import os
import shutil
import json
from sqlalchemy import and_
from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.models.progress import Progress
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.resume import Resume
from app.models.analysis import ResumeAnalysis
from app.utils.pdf_parser import extract_text
from app.services.gemini_service import analyze_resume
from app.services.resource_service import get_learning_resources

router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = "app/uploads/resumes"


# ----------------------------
# Upload + Analyze Resume
# ----------------------------
@router.post("/upload")
def upload_resume(
    user_id: int = Form(...),
    target_role: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume = Resume(
        UserId=user_id,
        TargetRole=target_role,
        FileName=file.filename,
        FilePath=file_path,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Extract text
    resume_text = extract_text(file_path)

    # Gemini analysis
    gemini_response = analyze_resume(resume_text, target_role)
    gemini_response["learning_resources"] = get_learning_resources(
    gemini_response.get("missing_skills", [])
    )
    # Save analysis safely
    analysis = ResumeAnalysis(
        ResumeId=resume.ResumeId,
        GeminiResponse=json.dumps(gemini_response, ensure_ascii=False),
    )

    db.add(analysis)
    db.commit()

    return {
        "message": "Resume analyzed successfully",
        "resume_id": resume.ResumeId,
        "analysis": gemini_response,
    }


# ----------------------------
# Resume History (FIXED)
# ----------------------------
@router.get("/history/{user_id}")
def get_resume_history(user_id: int, db: Session = Depends(get_db)):
    resumes = (
        db.query(Resume, ResumeAnalysis)
        .join(ResumeAnalysis, Resume.ResumeId == ResumeAnalysis.ResumeId)
        .filter(Resume.UserId == user_id)
        .all()
    )

    result = []

    for resume, analysis in resumes:
        try:
            parsed_analysis = json.loads(analysis.GeminiResponse)
        except Exception:
            parsed_analysis = {
                "error": "Invalid analysis format",
                "raw": analysis.GeminiResponse
            }

        result.append({
            "resume_id": resume.ResumeId,
            "file_name": resume.FileName,
            "target_role": resume.TargetRole,
            "uploaded_at": resume.UploadedAt,
            "analysis": parsed_analysis,
        })

    return result

@router.get("/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = (
        db.query(Resume)
        .filter(Resume.ResumeId == resume_id)
        .first()
    )

    if not resume:
        return {"message": "Resume not found"}

    analysis = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.ResumeId == resume_id)
        .first()
    )

    parsed_analysis = {}

    if analysis:
        try:
            parsed_analysis = json.loads(analysis.GeminiResponse)
        except Exception:
            parsed_analysis = analysis.GeminiResponse

    return {
        "resume_id": resume.ResumeId,
        "file_name": resume.FileName,
        "target_role": resume.TargetRole,
        "uploaded_at": resume.UploadedAt,
        "analysis": parsed_analysis,
    }

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = (
        db.query(Resume)
        .filter(Resume.ResumeId == resume_id)
        .first()
    )

    if not resume:
        return {"message": "Resume not found"}

    # Delete analysis first
    db.query(ResumeAnalysis).filter(
        ResumeAnalysis.ResumeId == resume_id
    ).delete()

    # Delete PDF file if it exists
    if resume.FilePath and os.path.exists(resume.FilePath):
        os.remove(resume.FilePath)

    # Delete resume record
    db.delete(resume)
    db.commit()

    return {"message": "Resume deleted successfully"}

@router.post("/{resume_id}/reanalyze")
def reanalyze_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = (
        db.query(Resume)
        .filter(Resume.ResumeId == resume_id)
        .first()
    )

    if not os.path.exists(resume.FilePath):
        raise HTTPException(
        status_code=404,
        detail="Original resume file not found. Please upload it again."
    )

    # Extract text from the saved PDF
    resume_text = extract_text(resume.FilePath)

    # Generate fresh Gemini analysis
    gemini_response = analyze_resume(
        resume_text,
        resume.TargetRole
    )
    gemini_response["learning_resources"] = get_learning_resources(
    gemini_response.get("missing_skills", [])
    )
    # Find existing analysis
    analysis = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.ResumeId == resume.ResumeId)
        .first()
    )

    if analysis:
        analysis.GeminiResponse = json.dumps(
            gemini_response,
            ensure_ascii=False
        )
    else:
        analysis = ResumeAnalysis(
            ResumeId=resume.ResumeId,
            GeminiResponse=json.dumps(
                gemini_response,
                ensure_ascii=False
            )
        )
        db.add(analysis)

    db.commit()

    return {
        "message": "Resume re-analyzed successfully",
        "analysis": gemini_response
    }
    
@router.get("/{resume_id}/resources")
def get_resources(resume_id: int, db: Session = Depends(get_db)):
    analysis = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.ResumeId == resume_id)
        .first()
    )

    if not analysis:
        return {"message": "Analysis not found"}

    text = analysis.GeminiResponse.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "", 1)

    if text.endswith("```"):
        text = text[:-3]

    text = text.strip()

    analysis_json = json.loads(text)

    skills = analysis_json.get("missing_skills", [])

    resources = get_learning_resources(skills)

    return {
        "resume_id": resume_id,
        "resources": resources
    }
    
@router.get("/{resume_id}/progress")
def get_progress(resume_id: int, db: Session = Depends(get_db)):

    progress = (
        db.query(Progress)
        .filter(Progress.ResumeId == resume_id)
        .all()
    )

    return [
        {
            "id": p.ProgressId,
            "type": p.ItemType,
            "name": p.ItemName,
            "completed": p.Completed
        }
        for p in progress
    ]
    
@router.post("/{resume_id}/progress")
def update_progress(
    resume_id: int,
    item_type: str,
    item_name: str,
    completed: bool,
    db: Session = Depends(get_db),
):

    progress = (
        db.query(Progress)
        .filter(
            and_(
                Progress.ResumeId == resume_id,
                Progress.ItemType == item_type,
                Progress.ItemName == item_name,
            )
        )
        .first()
    )

    if progress:

        progress.Completed = completed

    else:

        progress = Progress(
            ResumeId=resume_id,
            ItemType=item_type,
            ItemName=item_name,
            Completed=completed,
        )

        db.add(progress)

    db.commit()

    return {"message": "updated"}