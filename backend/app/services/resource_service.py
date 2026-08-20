import json

from app.services.gemini_service import client
from app.services.youtube_service import search_youtube


def get_learning_resources(skills):
    prompt = f"""
You are a career mentor.

For each skill below, recommend ONLY 2 high-quality online courses.

Return ONLY valid JSON.

Example format:

[
    {{
        "skill":"Docker",
        "courses":[
            {{
                "platform":"Coursera",
                "title":"Docker Essentials",
                "url":"https://coursera.org/..."
            }},
            {{
                "platform":"Udemy",
                "title":"Docker for Beginners",
                "url":"https://udemy.com/..."
            }}
        ]
    }}
]

Skills:

{skills}

Return ONLY JSON.
"""

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

    resources = json.loads(text)

    # Fetch YouTube videos using the YouTube API
    for resource in resources:
        resource["youtube"] = search_youtube(resource["skill"])

    return resources