# 论坛api接口
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

def init_db_articles():
    conn = sqlite3.connect('articles.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS topics
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, description TEXT)''')
    conn.commit()
    conn.close()
def init_db_users():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)''')
    conn.commit()
    conn.close()
init_db_articles()
init_db_users()

conn_articles = sqlite3.connect('articles.db', check_same_thread=False)
c_articles = conn_articles.cursor()
conn_users = sqlite3.connect('users.db', check_same_thread=False)
c_users = conn_users.cursor()

app = Flask(__name__)
CORS(app)

@app.route('/api/topics', methods=['GET'])
def get_topics():
    c_articles.execute('SELECT * FROM topics')
    topics = c_articles.fetchall()
    topics_list = [{'id': topic[0], 'name': topic[1], 'content': topic[2], 'description': topic[3]} for topic in topics]
    return jsonify(topics_list)


@app.route('/api/topics', methods=['POST'])
def create_topic():
    title = request.json['title']
    content = request.json['content']
    description = request.json['description']
    c_articles.execute('INSERT INTO topics (title, content, description) VALUES (?,?,?)', (title, content, description))
    conn_articles.commit()
    return jsonify({'message': 'Topic created successfully!'})

@app.route('/api/topics/<int:id>', methods=['GET'])
def get_topic(id):
    c_articles.execute('SELECT * FROM topics WHERE id=?', (id,))
    topic = c_articles.fetchone()
    topic_dict = {'id': topic[0], 'name': topic[1], 'content': topic[2], 'description': topic[3]}
    return jsonify(topic_dict)


@app.route('/api/topics/<int:id>', methods=['PUT'])
def update_topic(id):
    title = request.json['title']
    content = request.json['content']
    description = request.json['description']
    c_articles.execute('UPDATE topics SET title=?, content=? description=? WHERE id=?', (title, content, description, id))
    conn_articles.commit()
    return jsonify({'message': 'Topic updated successfully!'})

@app.route('/api/topics/<int:id>', methods=['DELETE'])
def delete_topic(id):
    c_articles.execute('DELETE FROM topics WHERE id=?', (id,))
    conn_articles.commit()
    return jsonify({'message': 'Topic deleted successfully!'})

@app.route('/api/topics/search', methods=['GET'])
def search_topic():
    keyword = request.args.get('keyword')
    c_articles.execute('SELECT * FROM topics WHERE title LIKE ?', ('%'+keyword+'%',))
    topics = c_articles.fetchall()
    topic_list = [{'id': topic[0], 'name': topic[1], 'content': topic[2], 'description': topic[3]} for topic in topics]
    return jsonify(topic_list)

@app.route('/api/accounts/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    c_users.execute('INSERT INTO users (username, password) VALUES (?,?)', (username, password))
    conn_users.commit()
    return jsonify({'message': 'Account registered successfully!'})

@app.route('/api/accounts/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    c_users.execute('SELECT * FROM users WHERE username=? AND password=?', (username, password))
    user = c_users.fetchone()
    if user:
        return jsonify({'message': 'Login successful!'})
    else:
        return jsonify({'message': 'Invalid username or password!'})

if __name__ == '__main__':
    app.run(debug=True)