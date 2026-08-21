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
        resources = json.loads(text)
    except Exception as e:
        print(f"Gemini API Error in get_learning_resources: {e}")
        # Return fallback dummy courses for each skill so the frontend still renders links
        resources = []
        for skill in skills:
            resources.append({
                "skill": skill,
                "courses": [
                    {
                        "platform": "Coursera",
                        "title": f"Introduction to {skill}",
                        "url": f"https://www.coursera.org/search?query={skill}"
                    },
                    {
                        "platform": "Udemy",
                        "title": f"Complete {skill} Bootcamp",
                        "url": f"https://www.udemy.com/courses/search/?q={skill}"
                    }
                ]
            })

    # Fetch YouTube videos using the YouTube API
    for resource in resources:
        resource["youtube"] = search_youtube(resource["skill"])

    return resources