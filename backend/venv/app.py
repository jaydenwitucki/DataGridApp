from quart import Quart
from flask_sock import Sock

app = Quart(__name__)
sock = Sock(app)

# Import WebSocket routes
from websocket import websocket_route

if __name__ == '__main__':
    app.run(debug=True)
    
