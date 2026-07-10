from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database.db import Base

class Progress(Base):
    __tablename__ = "Progress"

    ProgressId = Column(Integer, primary_key=True, index=True)
    ResumeId = Column(Integer, ForeignKey("Resumes.ResumeId"))
    ItemType = Column(String(50))      # "skill" or "roadmap"
    ItemName = Column(String(500))
    Completed = Column(Boolean, default=False)