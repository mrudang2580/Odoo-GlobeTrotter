from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import CommunityPost, User
from pydantic import BaseModel

router = APIRouter(prefix="/community", tags=["Community"])

class PostCreate(BaseModel):
    caption: str

@router.get("/posts")
def get_community_posts(db: Session = Depends(get_db)):
    posts = db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).all()
    results = []
    for p in posts:
        results.append({
            "id": p.id,
            "user_name": p.user.name if p.user else "Alex Wanderer",
            "caption": p.caption,
            "likes_count": p.likes_count,
            "created_at": p.created_at
        })
    return results

@router.post("/posts")
def create_post(payload: PostCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    post = CommunityPost(
        user_id=user.id if user else "mock-user",
        caption=payload.caption,
        likes_count=0
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
