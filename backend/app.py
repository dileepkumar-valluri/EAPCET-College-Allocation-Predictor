
from flask import Flask, jsonify, request

from backend.predictor import predict_colleges

app = Flask(__name__)

VALID_STATES = {"AP", "TG"}
VALID_AP_LOCAL_AREAS = {"ALL", "AU", "SVU"}


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "EAPCET College Allocation Predictor API",
        "supported_states": ["AP", "TG"],
        "local_area_filtering": {
            "AP": ["AU", "SVU"],
            "TG": "Unavailable in current dataset",
        },
        "status": "running",
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "error": "Request body must be valid JSON."
        }), 400

    required_fields = [
        "state",
        "rank",
        "category",
        "gender",
        "preferred_branch",
    ]

    missing_fields = [
        field for field in required_fields
        if field not in payload
    ]

    if missing_fields:
        return jsonify({
            "error": "Missing required fields.",
            "missing_fields": missing_fields,
        }), 400

    state = str(payload["state"]).strip().upper()
    local_area = str(payload.get("local_area", "")).strip().upper()

    if state not in VALID_STATES:
        return jsonify({
            "error": "State must be AP or TG."
        }), 400

    if state == "AP":
        if local_area not in VALID_AP_LOCAL_AREAS:
            return jsonify({
                "error": (
                    "For AP predictions, select ALL, AU or SVU local area."
                )
            }), 400

    elif local_area:
        return jsonify({
            "error": (
                "TG local-area filtering is unavailable because "
                "the current dataset does not contain local-area values."
            )
        }), 400

    try:
        results = predict_colleges(
            state=state,
            rank=payload["rank"],
            category=str(payload["category"]),
            gender=str(payload["gender"]),
            preferred_branch=str(payload["preferred_branch"]),
            limit=5,
            local_area=local_area if state == "AP" else None,
        )

        return jsonify({
            "state": state,
            "local_area": local_area if state == "AP" else None,
            "count": len(results),
            "disclaimer": (
                "Predictions use historical cutoff ranks and do not "
                "guarantee seat allotment. Local-area filtering must "
                "be validated against official counselling rules."
            ),
            "results": results.to_dict(orient="records"),
        }), 200

    except (ValueError, TypeError) as error:
        return jsonify({"error": str(error)}), 400

    except Exception:
        app.logger.exception("Prediction request failed")
        return jsonify({
            "error": "Unable to generate predictions."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
