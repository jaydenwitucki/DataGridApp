from sqlalchemy.future import select
from database import AsyncSessionLocal
from models import Item

async def add_item(name: str):
    async with AsyncSessionLocal() as session:
        new_item = Item(name=name)
        session.add(new_item)
        await session.commit()
        return new_item

async def get_items():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Item))
        return result.scalars().all()