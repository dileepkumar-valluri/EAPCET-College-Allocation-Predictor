import os
import re
import secrets
from flask_cors import CORS
from pymysql.err import IntegrityError, MySQLError
from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)
from backend.config import get_db_connection
from flask import Flask, jsonify, request, session

from backend.predictor import predict_colleges
from backend.college_analysis import analyze_college
from backend.phase_predictor import (
    predict_phase_wise,
    predict_all_three_phases,
)
from backend.ai_assistant import ai_assistant_bp

app = Flask(__name__)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://eapcet-college-allocation-predictor.onrender.com",
]

CORS(
    app,
    origins=allowed_origins,
    supports_credentials=True,
)

app.register_blueprint(ai_assistant_bp)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

if not app.secret_key:
    raise RuntimeError(
        "FLASK_SECRET_KEY is missing. Check your .env file."
    )

is_production = os.getenv("RENDER") == "true"

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = (
    "None" if is_production else "Lax"
)
app.config["SESSION_COOKIE_SECURE"] = is_production

# A guest gets one successful prediction across all prediction modes.
GUEST_COOKIE_NAME = "eapcet_guest_id"
GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2  # 2 years
VALID_STATES = {"AP", "TG"}
VALID_AP_LOCAL_AREAS = {"ALL", "AU", "SVU"}

DISCLAIMER = (
    "Predictions use historical cutoff ranks and do not guarantee "
    "seat allotment. Actual allotment depends on official counselling "
    "rules, seat availability, category, gender, local area and options."
)


def get_json_payload(required_fields):
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return None, ({
            "error": "Request body must be valid JSON."
        }, 400)

    missing_fields = [
        field for field in required_fields
        if field not in payload
    ]

    if missing_fields:
        return None, ({
            "error": "Missing required fields.",
            "missing_fields": missing_fields,
        }, 400)

    return payload, None


def get_guest_id():
    """Return the persistent guest ID from the browser cookie, or create one."""
    guest_id = request.cookies.get(GUEST_COOKIE_NAME)

    if not guest_id or not re.fullmatch(r"[a-f0-9]{64}", guest_id):
        guest_id = secrets.token_hex(32)

    return guest_id


def guest_has_used_free_prediction(guest_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT guest_id FROM guest_prediction_usage WHERE guest_id = %s",
                (guest_id,),
            )
            return cursor.fetchone() is not None
    finally:
        if connection:
            connection.close()


def mark_guest_prediction_used(guest_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT IGNORE INTO guest_prediction_usage (guest_id) VALUES (%s)",
                (guest_id,),
            )
        connection.commit()
    except Exception:
        if connection:
            connection.rollback()
        raise
    finally:
        if connection:
            connection.close()


def check_guest_prediction_access():
    """Return (guest_id, response). Logged-in users have unlimited predictions."""
    if session.get("student_id"):
        return None, None

    guest_id = get_guest_id()
    try:
        if guest_has_used_free_prediction(guest_id):
            response = jsonify({
                "error": "Your free prediction has been used. Please log in or register to continue.",
                "code": "GUEST_PREDICTION_LIMIT_REACHED",
                "requires_auth": True,
            })
            response.status_code = 403
            return guest_id, attach_guest_cookie(response, guest_id)
    except Exception:
        app.logger.exception("Guest prediction limit check failed")
        return guest_id, (jsonify({
            "error": "Unable to verify free prediction availability. Please try again."
        }), 500)

    return guest_id, None


def finish_guest_prediction(response, guest_id):
    """Record a guest's free prediction after a successful result is generated."""
    if guest_id:
        try:
            mark_guest_prediction_used(guest_id)
        except Exception:
            app.logger.exception("Failed to record guest prediction usage")
            return jsonify({
                "error": "Unable to record free prediction usage. Please try again."
            }), 500
        attach_guest_cookie(response, guest_id)

    return response, 200


def attach_guest_cookie(response, guest_id):
    response.set_cookie(
        GUEST_COOKIE_NAME,
        guest_id,
        max_age=GUEST_COOKIE_MAX_AGE,
        httponly=True,
        secure=request.is_secure,
        samesite="Lax",
    )
    return response


def validate_tg_phase_request(payload):
    state = str(payload.get("state", "TG")).strip().upper()

    if state != "TG":
        return None, ({
            "error": (
                "Phase-wise predictions are currently supported only "
                "for TG because AP phase data is unavailable."
            )
        }, 400)

    return state, None


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "EAPCET College Allocation Predictor API",
        "supported_states": ["AP", "TG"],
        "local_area_filtering": {
            "AP": ["ALL", "AU", "SVU"],
            "TG": "Unavailable in current dataset",
        },
        "endpoints": [
            "/api/predict",
            "/api/college-analysis",
            "/api/predict-by-phase",
            "/api/predict-all-phases",
        ],
        "status": "running",
    })


@app.route("/api/register", methods=["POST"])
def register_student():
    payload, error = get_json_payload([
        "full_name",
        "email",
        "password",
    ])

    if error:
        return jsonify(error[0]), error[1]

    full_name = str(payload["full_name"]).strip()
    email = str(payload["email"]).strip().lower()
    password = payload["password"]
    mobile = str(payload.get("mobile", "")).strip() or None
    location = str(payload.get("location", "")).strip() or None

    if not full_name:
        return jsonify({"error": "Full name is required."}), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"error": "Enter a valid email address."}), 400

    if not isinstance(password, str) or len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters."
        }), 400

    if mobile and not re.fullmatch(r"[0-9+\-\s()]{7,15}", mobile):
        return jsonify({"error": "Enter a valid mobile number."}), 400

    password_hash = generate_password_hash(password)

    connection = None

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO students
                    (full_name, email, mobile,location, password_hash)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (full_name, email, mobile, location, password_hash),
            )

            student_id = cursor.lastrowid

        connection.commit()

        return jsonify({
            "message": "Registration successful.",
            "student": {
                "student_id": student_id,
                "full_name": full_name,
                "email": email,
            },
        }), 201

    except IntegrityError:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "An account with this email already exists."
        }), 409

    except MySQLError:
        if connection:
            connection.rollback()

        app.logger.exception("Database error during registration.")

        return jsonify({
            "error": "Unable to complete registration right now."
        }), 500

    finally:
        if connection:
            connection.close()


@app.route("/api/login", methods=["POST"])
def login_student():
    payload, error = get_json_payload([
        "email",
        "password",
    ])

    if error:
        return jsonify(error[0]), error[1]

    email = str(payload["email"]).strip().lower()
    password = payload["password"]

    if not isinstance(password, str) or not password:
        return jsonify({"error": "Email and password are required."}), 400

    connection = None

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT student_id, full_name, email, password_hash
                FROM students
                WHERE email = %s
                """,
                (email,),
            )
            student = cursor.fetchone()

        if not student or not check_password_hash(
            student["password_hash"], password
        ):
            return jsonify({
                "error": "Invalid email or password."
            }), 401

        session.clear()
        session["student_id"] = student["student_id"]

        return jsonify({
            "message": "Login successful.",
            "student": {
                "student_id": student["student_id"],
                "full_name": student["full_name"],
                "email": student["email"],
            },
        }), 200

    except MySQLError:
        app.logger.exception("Database error during login.")

        return jsonify({
            "error": "Unable to process login right now."
        }), 500

    finally:
        if connection:
            connection.close()


@app.route("/api/profile", methods=["GET"])
def student_profile():
    student_id = session.get("student_id")

    if not student_id:
        return jsonify({
            "error": "Please log in to access your profile."
        }), 401

    connection = None

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT student_id, full_name, email, mobile, location,
                       created_at
                FROM students
                WHERE student_id = %s
                """,
                (student_id,),
            )
            student = cursor.fetchone()

        if not student:
            session.clear()
            return jsonify({
                "error": "Student account not found."
            }), 404

        if student["created_at"]:
            student["created_at"] = student["created_at"].isoformat()

        return jsonify({
            "student": student
        }), 200

    except MySQLError:
        app.logger.exception("Database error while loading profile.")

        return jsonify({
            "error": "Unable to load profile right now."
        }), 500

    finally:
        if connection:
            connection.close()


@app.route("/api/logout", methods=["POST"])
def logout_student():
    if not session.get("student_id"):
        return jsonify({
            "error": "You are not logged in."
        }), 401

    session.clear()

    return jsonify({
        "message": "Logout successful."
    }), 200


@app.route("/api/prediction-history", methods=["GET"])
def get_prediction_history():
    student_id = session.get("student_id")

    if not student_id:
        return jsonify({"error": "Please log in to view prediction history."}), 401

    connection = None

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    history_id,
                    state,
                    exam_rank,
                    category,
                    gender,
                    preferred_branch,
                    created_at
                FROM prediction_history
                WHERE student_id = %s
                ORDER BY created_at DESC
                """,
                (student_id,),
            )

            history = cursor.fetchall()

        for item in history:
            if item["created_at"]:
                item["created_at"] = item["created_at"].isoformat()

        return jsonify({
            "count": len(history),
            "history": history,
        }), 200

    except Exception:
        app.logger.exception("Failed to retrieve prediction history")
        return jsonify({"error": "Unable to retrieve prediction history."}), 500

    finally:
        if connection:
            connection.close()


@app.route("/api/predict", methods=["POST"])
def predict():
    payload, error = get_json_payload([
        "state",
        "rank",
        "category",
        "gender",
        "preferred_branch",
    ])

    if error:
        return jsonify(error[0]), error[1]

    state = str(payload["state"]).strip().upper()
    local_area = str(payload.get("local_area", "")).strip().upper()

    if state not in VALID_STATES:
        return jsonify({"error": "State must be AP or TG."}), 400

    if state == "AP":
        if local_area not in VALID_AP_LOCAL_AREAS:
            return jsonify({
                "error": "For AP predictions, select ALL, AU or SVU."
            }), 400
    elif local_area:
        return jsonify({
            "error": (
                "TG local-area filtering is unavailable because "
                "the current dataset does not contain local-area values."
            )
        }), 400

    guest_id, access_response = check_guest_prediction_access()
    if access_response is not None:
        if isinstance(access_response, tuple):
            return access_response
        return access_response, access_response.status_code

    try:
        student_id = session.get("student_id")
        results = predict_colleges(
            state=state,
            rank=payload["rank"],
            category=str(payload["category"]),
            gender=str(payload["gender"]),
            preferred_branch=str(payload["preferred_branch"]),
            limit=5,
            local_area=local_area if state == "AP" else None,
        )
        if student_id:
            connection = None
            try:
                connection = get_db_connection()

                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO prediction_history (
                            student_id,
                            state,
                            exam_rank,
                            category,
                            gender,
                            preferred_branch
                        )
                        VALUES (%s, %s, %s, %s, %s, %s)
                        """,
                        (
                            student_id,
                            state,
                            int(payload["rank"]),
                            str(payload["category"]),
                            str(payload["gender"]),
                            str(payload["preferred_branch"]),
                        ),
                    )

                connection.commit()

            except Exception:
                app.logger.exception(
                    "Failed to save prediction history"
                )

            finally:
                if connection:
                    connection.close()
        response = jsonify({
            "state": state,
            "local_area": local_area if state == "AP" else None,
            "count": len(results),
            "disclaimer": DISCLAIMER,
            "results": results.to_dict(orient="records"),
        })
        return finish_guest_prediction(response, guest_id)

    except (ValueError, TypeError) as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception:
        app.logger.exception("Prediction request failed")
        return jsonify({"error": "Unable to generate predictions."}), 500


@app.route("/api/college-analysis", methods=["POST"])
def college_analysis():
    payload, error = get_json_payload([
        "state",
        "college_code",
        "branch_code",
        "rank",
        "category",
        "gender",
    ])

    if error:
        return jsonify(error[0]), error[1]

    state = str(payload["state"]).strip().upper()
    local_area = str(payload.get("local_area", "")).strip().upper()

    if state not in VALID_STATES:
        return jsonify({"error": "State must be AP or TG."}), 400

    if state == "AP":
        if local_area not in VALID_AP_LOCAL_AREAS:
            return jsonify({
                "error": "For AP analysis, select ALL, AU or SVU."
            }), 400
    elif local_area:
        return jsonify({
            "error": "TG local-area filtering is unavailable."
        }), 400

    try:
        results = analyze_college(
            state=state,
            college_code=payload["college_code"],
            branch_code=payload["branch_code"],
            rank=payload["rank"],
            category=str(payload["category"]),
            gender=str(payload["gender"]),
            local_area=local_area if state == "AP" else None,
        )

        return jsonify({
            "state": state,
            "local_area": local_area if state == "AP" else None,
            "college_code": str(payload["college_code"]).strip().upper(),
            "branch_code": str(payload["branch_code"]).strip().upper(),
            "count": len(results),
            "disclaimer": DISCLAIMER,
            "results": results.to_dict(orient="records"),
        }), 200

    except (ValueError, TypeError) as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception:
        app.logger.exception("College analysis request failed")
        return jsonify({"error": "Unable to analyze this college."}), 500


@app.route("/api/predict-by-phase", methods=["POST"])
def predict_by_phase():
    payload, error = get_json_payload([
        "rank",
        "category",
        "gender",
        "preferred_branch",
    ])

    if error:
        return jsonify(error[0]), error[1]

    _, error = validate_tg_phase_request(payload)

    if error:
        return jsonify(error[0]), error[1]

    guest_id, access_response = check_guest_prediction_access()
    if access_response is not None:
        if isinstance(access_response, tuple):
            return access_response
        return access_response, access_response.status_code

    try:
        results = predict_phase_wise(
            rank=payload["rank"],
            category=str(payload["category"]),
            gender=str(payload["gender"]),
            preferred_branch=str(payload["preferred_branch"]),
            limit=5,
        )

        counts = {
            phase: len(colleges)
            for phase, colleges in results.items()
        }

        response = jsonify({
            "state": "TG",
            "mode": "phase_wise",
            "phase_order": ["First", "Second", "Final"],
            "counts": counts,
            "results": {
                phase: colleges
                for phase, colleges in results.items()
            },
            "disclaimer": DISCLAIMER,
        })
        return finish_guest_prediction(response, guest_id)

    except (ValueError, TypeError) as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception:
        app.logger.exception("Phase-wise prediction failed")
        return jsonify({
            "error": "Unable to generate phase-wise predictions."
        }), 500


@app.route("/api/predict-all-phases", methods=["POST"])
def predict_all_phases():
    payload, error = get_json_payload([
        "rank",
        "category",
        "gender",
        "preferred_branch",
    ])

    if error:
        return jsonify(error[0]), error[1]

    _, error = validate_tg_phase_request(payload)

    if error:
        return jsonify(error[0]), error[1]

    guest_id, access_response = check_guest_prediction_access()
    if access_response is not None:
        if isinstance(access_response, tuple):
            return access_response
        return access_response, access_response.status_code

    try:
        results = predict_all_three_phases(
            rank=payload["rank"],
            category=str(payload["category"]),
            gender=str(payload["gender"]),
            preferred_branch=str(payload["preferred_branch"]),
            limit=5,
        )

        response = jsonify({
            "state": "TG",
            "mode": "all_three_phases",
            "count": int(results["college_code"].nunique())
            if not results.empty else 0,
            "results": results.to_dict(orient="records"),
            "disclaimer": DISCLAIMER,
        })
        return finish_guest_prediction(response, guest_id)

    except (ValueError, TypeError) as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception:
        app.logger.exception("All-phase prediction failed")
        return jsonify({
            "error": "Unable to generate all-phase predictions."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
