import os
import logging
import httpx
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

LLM_API_KEY = os.getenv("LLM_API_KEY", "your_key_here")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")

# Strict token budget to prevent cost overruns during demo iterations
MAX_TOKENS = 300
TEMPERATURE = 0.2


def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = MAX_TOKENS) -> str:
    """
    Executes an LLM completion with cost bounding, timeout handling, and
    fail-safe fallback.

    Architecture Note:
    The LLM layer is strictly decoupled from entitlement decisions.
    Under no circumstances is the LLM used to determine boolean eligibility.
    It functions exclusively as an auditable text generation and query translation layer.
    """
    # If placeholder key or offline demo mode, use high-fidelity template engine
    if not LLM_API_KEY or LLM_API_KEY.startswith("your_key") or LLM_API_KEY == "placeholder":
        logger.info("Using built-in deterministic phrasing generator (LLM API key not configured).")
        return None

    try:
        if LLM_PROVIDER == "openai":
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {LLM_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": LLM_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "max_tokens": max_tokens,
                "temperature": TEMPERATURE,
            }
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"].strip()
                else:
                    logger.warning(f"LLM API returned status {resp.status_code}: {resp.text}")
                    return None

        elif LLM_PROVIDER == "gemini":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={LLM_API_KEY}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{system_prompt}\n\nUser Request: {user_prompt}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "maxOutputTokens": max_tokens,
                    "temperature": TEMPERATURE,
                },
            }
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"].strip()
                else:
                    logger.warning(f"Gemini API returned status {resp.status_code}")
                    return None

    except Exception as e:
        logger.error(f"LLM invocation failed gracefully: {e}")
        return None

    return None
