import select
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from database import AsyncSessionLocal

Base = declarative_base()

class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)
    name = Column(String)

async def get_items():
    async with AsyncSessionLocal() as session:
        async with session.begin():
            result = await session.execute(
                select(Item)
            )
            items = result.scalars().all()
            return items

async def add_item(name: str):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            new_item = Item(name=name)
            session.add(new_item)
            await session.commit()
            return new_item

async def update_item(item_id: int, name: str):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            item = await session.get(Item, item_id)
            if item:
                item.name = name
                await session.commit()
                return item
            return None

async def delete_item(item_id: int):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            item = await session.get(Item, item_id)
            if item:
                await session.delete(item)
                await session.commit()
                return True
            return False