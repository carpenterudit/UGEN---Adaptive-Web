"""Database setup with SQLAlchemy."""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# For SQLite on Windows, use standard sqlite:///./upgw.db
db_url = settings.DATABASE_URL.replace("+aiosqlite", "")

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {},
    echo=False
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def create_tables():
    """Create all database tables synchronously without greenlet requirement."""
    from app.models import project, conversation, ui_spec, revision, preferences  # noqa: F401
    Base.metadata.create_all(bind=engine)


def get_db() -> Session:
    """Dependency for getting DB session."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
