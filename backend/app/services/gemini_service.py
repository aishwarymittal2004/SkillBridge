import os
import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai

# Load .env from backend folder
load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=True)

# Configure Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_resume(resume_text, target_role):
    prompt = f"""
You are an expert ATS and resume reviewer.

Analyze the resume against the target role.

Return ONLY valid JSON.

{{
    "ats_score": 0,
    "ats_explanation": "",
    "missing_skills": [],
    "strengths": [],
    "weaknesses": [],
    "project_ideas": [
        {{
            "name": "",
            "description": "",
            "skills_developed": []
        }}
    ],
    "roadmap": []
}}

Rules:
- Output ONLY JSON.
- No markdown.
- No explanation outside JSON.
- ATS score must be between 0 and 100.
- Give 5-10 missing skills.
- Give 3-5 strengths.
- Give 3-5 weaknesses.
- Suggest exactly 3 practical portfolio projects.
- Each project must include name, description and skills_developed.
- Give an 8-step learning roadmap.
- ats_explanation should explain the score in 2-4 concise sentences.

Target Role:
{target_role}

Resume:
{resume_text}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text.replace("```json", "", 1)
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error in analyze_resume: {e}")
        return {
            "ats_score": 50,
            "ats_explanation": f"Failed to analyze resume due to AI service limit ({e}). Please try again later.",
            "missing_skills": ["System Design", "Cloud Architecture"],
            "strengths": ["Basic Programming"],
            "weaknesses": ["Advanced Concepts"],
            "project_ideas": [
                {
                    "name": "Portfolio Project",
                    "description": "A sample project to demonstrate skills.",
                    "skills_developed": ["React", "Python"]
                }
            ],
            "roadmap": ["Review AI limits and try again."]
        }