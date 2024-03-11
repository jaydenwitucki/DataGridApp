items = []

def add_item(name):
    """Add a new item to the in-memory list with a generated ID."""
    new_id = len(items) + 1  # Simple ID generation
    item = {'id': new_id, 'name': name}
    items.append(item)
    return item

def get_item(item_id):
    """Retrieve an item by ID from the in-memory list."""
    for item in items:
        if item['id'] == item_id:
            return item
    return None

def get_items():
    """Retrieve all items."""
    return items

def update_item(item_id, name):
    """Update an existing item's name by ID."""
    for item in items:
        if item['id'] == item_id:
            item['name'] = name
            return item
    return None

def delete_item(item_id):
    """Delete an item by ID from the in-memory list."""
    global items
    items = [item for item in items if item['id'] != item_id]