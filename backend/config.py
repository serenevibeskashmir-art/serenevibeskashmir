from dotenv import load_dotenv

load_dotenv()

import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///travel.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
