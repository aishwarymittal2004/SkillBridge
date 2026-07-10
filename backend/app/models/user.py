from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.db import Base




class User(Base):
    __tablename__ = "Users"

    UserId = Column(Integer, primary_key=True, index=True)
    FullName = Column(String(100), nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    PasswordHash = Column(String(255), nullable=False)
    CreatedAt = Column(DateTime, server_default=func.now())