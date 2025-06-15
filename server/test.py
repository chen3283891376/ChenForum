import requests as r

url = "http://localhost:5000/api/topics"
# for i in range(10):
#     response = r.post(url, json={"title": f"test{i+1}", "content": "```python\nprint('hello world')\n```", "description": "test description"})
#     print(response.json())
# response = r.post(url, json={"title": "test11", "content": "```python\nprint('hello world')\n$$\int_a^b f(x) \, dx$$\n```", "description": "test description"})

import sqlite3

conn = sqlite3.connect('users.db')
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(users)")
for column in cursor.fetchall():
    print(column)

conn.close()
