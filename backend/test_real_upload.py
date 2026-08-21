import requests

url = "http://localhost:8000/resume/upload"
data = {
    "user_id": 1,
    "target_role": "Software Engineer"
}

file_path = "e:/Skillbridge/skillbridge/backend/app/uploads/resumes/Aishwary_resume.pdf"
with open(file_path, "rb") as f:
    files = {
        "file": ("Aishwary_resume.pdf", f, "application/pdf")
    }
    try:
        response = requests.post(url, data=data, files=files)
        print("Status Code:", response.status_code)
        if response.status_code != 200:
            print("Response:", response.text)
        else:
            print("Success")
    except Exception as e:
        print(f"Error: {e}")
