from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, func
from app.database.db import Base


class ResumeAnalysis(Base):
    __tablename__ = "ResumeAnalysis"

    AnalysisId = Column(Integer, primary_key=True, index=True)

    ResumeId = Column(Integer, ForeignKey("Resumes.ResumeId"), nullable=False)

    GeminiResponse = Column(Text, nullable=False)

    CreatedAt = Column(DateTime, server_default=func.now())