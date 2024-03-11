import json
from crud import add_item
from quart import websocket
from app import sock
from models import items
from schemas import ItemSchema
from databases import database
from models import Item

clients = set()


def websocket_route(Session):
    @sock.route('/ws')
    async def websocket_handler(ws):
        session = Session()

        # Retrieve items from the database and send them to the client
        items = session.query(Item).all()
        await ws.send(json.dumps([item.__dict__ for item in items]))

        try:
            while True:
                # Handle WebSocket messages and database updates
                data = await ws.receive()
                await broadcast(data)
                command, *params = data.split(',')
                if command == 'add':
                    item_name = params[0]
                    added_item = add_item(item_name)  # Use the add_item function from models.py
                    await broadcast(f"Item added: {added_item}")  # Notify all clients
        finally:
            session.close()
def setup_websockets(sock):
    sock.route('/ws')(websocket_route)
    
async def broadcast(message):
    for client in clients:
        await client.send(message)