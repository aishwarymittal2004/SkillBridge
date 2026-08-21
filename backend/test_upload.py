import json
from app.services.gemini_service import analyze_resume
from app.services.resource_service import get_learning_resources

try:
    gemini_response = analyze_resume("I am a software engineer with Python skills", "Software Engineer")
    print("Analyze OK")
    resources = get_learning_resources(gemini_response.get("missing_skills", []))
    print("Resources OK")
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
