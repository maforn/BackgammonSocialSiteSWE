from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL")

# OAuth2 setup
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120))