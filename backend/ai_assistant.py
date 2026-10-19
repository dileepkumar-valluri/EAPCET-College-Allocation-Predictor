
"""Groq-powered student assistant blueprint for EAPCET."""

import json
import os
import time

from flask import Blueprint, jsonify, request

ai_assistant_bp = Blueprint("ai_assistant", __name__)

SYSTEM_PROMPT = """You are the AI Student Assistant inside EAPCET, an AP and Telangana EAPCET college guidance app.
Help students understand their rank, historical college cutoff matches, branches, and counselling phases. Reply in English, Telugu, or Tenglish depending on the student's language.

Rules:
- Treat supplied student profile, saved colleges, and historical matches as the only app-specific facts you have.
- Never invent college names, cutoff ranks, addresses, official dates, seat counts, or admission probabilities.
- Historical cutoff matches do not guarantee admission or seat allotment.
- If context does not contain an answer, say what is missing and recommend checking the official counselling website or notification.
- Give practical, balanced suggestions and encourage comparing multiple options.
- Never ask for passwords, API keys, or other secrets.
- For unrelated questions, answer briefly if useful, then steer back to student and college guidance.
- Answer the student's full question.
- For simple questions, answer in 2-4 sentences.
- For detailed guidance, use clear headings and 4-6 actionable bullet points.
- Start with the direct answer and avoid unnecessary repetition.
- Use clear headings and bullet points when useful.
"""


@ai_assistant_bp.post("/api/ai-assistant")
def ai_assistant_chat():
    body = request.get_json(silent=True) or {}
    message = body.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "error": "Please enter a question for the AI assistant."
        }), 400

    message = message.strip()

    if len(message) > 1200:
        return jsonify({
            "error": "Please keep your message under 1,200 characters."
        }), 400

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return jsonify({
            "error": "Groq is not configured. Check the project .env file."
        }), 503

    try:
        from groq import Groq

        context = body.get("context", {})
        if not isinstance(context, dict):
            context = {}

        context_json = json.dumps(
            context, ensure_ascii=False, default=str
        )[:10000]

        prompt_parts = [
            "Student's current EAPCET app context (JSON):",
            context_json,
            "\nRecent conversation:",
        ]

        history = body.get("history", [])

        if isinstance(history, list):
            for item in history[-8:]:
                if not isinstance(item, dict):
                    continue

                role = item.get("role")
                content = item.get("content")

                if (
                    role in ("user", "assistant")
                    and isinstance(content, str)
                    and content.strip()
                ):
                    if role == "user" and content.strip() == message:
                        continue

                    label = "Student" if role == "user" else "Assistant"
                    prompt_parts.append(f"{label}: {content[:1200]}")

        prompt_parts.append(f"\nCurrent student question: {message}")
        prompt = "\n".join(prompt_parts)

        print(f"Prompt size: {len(prompt)} characters")
        print(
            "History messages: "
            f"{len(history) if isinstance(history, list) else 0}"
        )

        client = Groq(api_key=api_key)
        model = os.getenv(
            "GROQ_MODEL", "llama-3.3-70b-versatile"
        )

        start_time = time.perf_counter()

        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_completion_tokens=1000,
        )

        elapsed = time.perf_counter() - start_time
        reply = completion.choices[0].message.content

        print(f"Groq response time: {elapsed:.2f} seconds")
        print(
            f"Groq reply length: {len(reply) if reply else 0} characters"
        )

        if not reply or not reply.strip():
            return jsonify({
                "error": "The AI returned an empty response. Please try again."
            }), 502

        return jsonify({"reply": reply.strip()}), 200

    except ImportError:
        return jsonify({
            "error": "Groq package is missing. Run: pip install groq"
        }), 500

    except Exception as exc:
        error_text = str(exc).lower()
        error_name = type(exc).__name__.lower()

        # Log the error type, not the full exception, to avoid
        # accidentally exposing sensitive request details.
        print(f"Groq assistant error: {type(exc).__name__}")

        if (
            "429" in error_text
            or "rate_limit" in error_text
            or "ratelimit" in error_name
        ):
            error_message = (
                "Groq's request limit has been reached. "
                "Please wait before trying again."
            )
        elif (
            "401" in error_text
            or "authentication" in error_text
            or "permission_denied" in error_text
        ):
            error_message = (
                "Groq authentication failed. "
                "Check the GROQ_API_KEY in your .env file."
            )
        elif "model" in error_text and (
            "not found" in error_text or "decommissioned" in error_text
        ):
            error_message = (
                "The configured Groq model is unavailable. "
                "Check GROQ_MODEL against the models available to your account."
            )
        elif (
            "503" in error_text
            or "unavailable" in error_text
            or "timeout" in error_text
        ):
            error_message = (
                "Groq is temporarily unavailable. Please try again shortly."
            )
        else:
            error_message = (
                "The AI service could not respond. Please try again shortly."
            )

        return jsonify({"error": error_message}), 502
