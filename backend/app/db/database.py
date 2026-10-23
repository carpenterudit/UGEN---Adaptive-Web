"""Database setup with SQLAlchemy."""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# Normalize database URL
db_url = settings.DATABASE_URL.replace("+aiosqlite", "")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine_kwargs = {}
if "sqlite" in db_url:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Supabase PostgreSQL connection pool handling
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(
    db_url,
    echo=False,
    **engine_kwargs
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
