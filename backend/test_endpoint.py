import requests

url = "http://localhost:8000/resume/upload"
data = {
    "user_id": 1,
    "target_role": "Software Engineer"
}
files = {
    "file": ("test_resume.pdf", b"dummy pdf content", "application/pdf")
}
try:
    response = requests.post(url, data=data, files=files)
    print("Status Code:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print(f"Error: {e}")
