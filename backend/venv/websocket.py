import json
from models import add_item, get_item, get_items, update_item, delete_item
from quart import websocket

from models import items
from schemas import ItemSchema

clients = set()


async def websocket_route():
    from app import sock  # Import here, inside the function that needs it
    clients.add(websocket._get_current_object())
    try:
        while True:
            data = await websocket.receive()
            await broadcast(data)
            command, *params = data.split(',')
            if command == 'add':
                item_name = params[0]
                added_item = add_item(item_name)  # Use the add_item function from models.py
                await broadcast(f"Item added: {added_item}")  # Notify all clients
            elif command == 'get':
                item_id = params['id']
                item = get_item(item_id)
                await broadcast(json.dumps({"type": "get", "data": item}))
            elif command == 'getAll':
                items = get_items()
                await broadcast(json.dumps({"type": "getAll", "data": items}))
            elif command == 'update':
                item_id = params['id']
                item_name = params['name']
                updated_item = update_item(item_id, item_name)
                await broadcast(json.dumps({"type": "update", "data": updated_item}))
            elif command == 'delete':
                item_id = params['id']
                delete_item(item_id)
                await broadcast(json.dumps({"type": "delete", "id": item_id}))
    finally:
        clients.remove(websocket._get_current_object())

async def broadcast(message):
    for client in clients:
        await client.send(message)