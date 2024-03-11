from quart import Quart
from flask_sock import Sock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

app = Quart(__name__)
sock = Sock(app)

DATABASE_URL = "sqlite:///app.db"  # Example: SQLite database
engine = create_engine(DATABASE_URL)

# Create tables
Base.metadata.create_all(engine)

# Create a Session class to interact with the database
Session = sessionmaker(bind=engine)

# Import WebSocket routes


    
from websocket import websocket_route
websocket_route(Session)

if __name__ == '__main__':
    
    app.run(debug=True)
    
