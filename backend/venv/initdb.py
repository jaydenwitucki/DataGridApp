from sqlalchemy import create_engine
from models import metadata, DATABASE_URL

engine = create_engine(DATABASE_URL)
metadata.create_all(engine)