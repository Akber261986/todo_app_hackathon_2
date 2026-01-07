from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import uuid
from typing import Optional
from pydantic import BaseModel
from ...database.session import engine
from ...models.user import User
from ...schemas.user import UserCreate, UserResponse
from ...auth.jwt import create_access_token, get_current_user_id, verify_password, get_password_hash


router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate):
    """
    Create a new user account
    """
    with Session(engine) as session:
        # Check if user already exists
        existing_user = session.exec(
            select(User).where(User.email == user_data.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        hashed_password = get_password_hash(user_data.password)
        user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return user


@router.post("/auth/signin", response_model=Token)
def signin(login_data: LoginRequest):
    """
    Authenticate user and return access token
    """
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == login_data.email)
        ).first()

        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer"}


@router.post("/auth/signout")
def signout():
    """
    Sign out the current user (token invalidation would be handled on frontend/client side)
    """
    return {"message": "Successfully signed out"}