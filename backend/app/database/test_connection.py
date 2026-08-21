from sqlalchemy import text
from app.database.db import engine
from app.database.db import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT DB_NAME()"))
        print("Connected to:", result.scalar())
except Exception as e:
    print("Connection Failed!")
    print(e)