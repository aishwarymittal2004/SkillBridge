from pydantic import BaseModel


class ResumeResponse(BaseModel):
    message: str
    resume_id: int