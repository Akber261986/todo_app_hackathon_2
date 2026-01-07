# JWT Authentication Middleware
import jwt
import os
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional

# Initialize JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

class TokenData(BaseModel):
    user_id: str
    username: Optional[str] = None

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            token = credentials.credentials
            token_data = self.verify_jwt(token)
            if not token_data:
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return token_data
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")
    
    def verify_jwt(self, token: str) -> Optional[TokenData]:
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
            user_id: str = payload.get("user_id")
            if user_id:
                return TokenData(user_id=user_id)
        except jwt.ExpiredSignatureError:
            print("Token expired")
        except jwt.JWTError:
            print("JWT error")
        return None

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt
