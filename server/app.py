# 论坛api接口
from flask import Flask, request, jsonify
import sqlite3, hashlib

def init_db_articles():
    conn = sqlite3.connect('articles.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS topics
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, description TEXT, author TEXT)''')
    conn.commit()
    conn.close()
def init_db_comments():
    conn = sqlite3.connect('comments.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS comments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, author TEXT, topic_id INTEGER)''')
    conn.commit()
    conn.close()
def init_db_likes():
    conn = sqlite3.connect('likes.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS likes
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, topic_id INTEGER)''')
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
init_db_comments()
init_db_likes()
init_db_users()

conn_articles = sqlite3.connect('articles.db', check_same_thread=False)
c_articles = conn_articles.cursor()
conn_users = sqlite3.connect('users.db', check_same_thread=False)
c_users = conn_users.cursor()
conn_comments = sqlite3.connect('comments.db', check_same_thread=False)
c_comments = conn_comments.cursor()
conn_likes = sqlite3.connect('likes.db', check_same_thread=False)
c_likes = conn_likes.cursor()

app = Flask(__name__)

@app.route('/api/topics', methods=['GET'])
def get_topics():
    c_articles.execute('SELECT * FROM topics')
    topics = c_articles.fetchall()
    topics_list = [{'id': topic[0], 'name': topic[1], 'content': topic[2], 'description': topic[3], 'author': topic[4]} for topic in topics]
    topics_list.reverse()
    return jsonify(topics_list)


@app.route('/api/topics', methods=['POST'])
def create_topic():
    title = request.json['title']
    content = request.json['content']
    description = request.json['description']
    author = request.json['author']
    c_articles.execute('INSERT INTO topics (title, content, description, author) VALUES (?,?,?,?)', (title, content, description, author))
    conn_articles.commit()
    return jsonify({'message': '文章创建成功!'})

@app.route('/api/topics/<int:id>', methods=['GET'])
def get_topic(id):
    c_articles.execute('SELECT * FROM topics WHERE id=?', (id,))
    topic = c_articles.fetchone()
    topic_dict = {'id': topic[0], 'name': topic[1], 'content': topic[2], 'description': topic[3], 'author': topic[4]}
    return jsonify(topic_dict)


@app.route('/api/topics/<int:id>', methods=['PUT'])
def update_topic(id):
    title = request.json['title']
    content = request.json['content']
    description = request.json['description']
    author = request.json['author']
    c_articles.execute('UPDATE topics SET title=?, content=? description=? author=? WHERE id=?', (title, content, description, author, id))
    conn_articles.commit()
    return jsonify({'message': '文章更新成功!'})

@app.route('/api/topics/<int:id>', methods=['DELETE'])
def delete_topic(id):
    c_articles.execute('DELETE FROM topics WHERE id=?', (id,))
    conn_articles.commit()
    return jsonify({'message': '文章删除成功!'})

@app.route('/api/topics/<int:id>/comments', methods=['GET'])
def get_comments(id):
    c_comments.execute('SELECT * FROM comments WHERE topic_id=?', (id,))
    comments = c_comments.fetchall()
    comments_list = [{'id': comment[0], 'content': comment[1], 'author': comment[2], 'topic_id': comment[3]} for comment in comments]
    comments_list.reverse()
    return jsonify(comments_list)

@app.route('/api/topics/<int:id>/comments', methods=['POST'])
def create_comment(id):
    content = request.json['content']
    author = request.json['author']
    c_comments.execute('INSERT INTO comments (content, author, topic_id) VALUES (?,?,?)', (content, author, id))
    conn_comments.commit()
    return jsonify({'message': '评论创建成功!'})

@app.route('/api/topics/<int:id>/likes', methods=['GET'])
def get_likes(id):
    c_likes.execute('SELECT * FROM likes WHERE topic_id=?', (id,))
    likes = c_likes.fetchall()
    return jsonify({'likes': len(likes)})

@app.route('/api/topics/<int:id>/likes', methods=['POST'])
def create_like(id):
    username = request.json['username']
    c_likes.execute('INSERT INTO likes (username, topic_id) VALUES (?,?)', (username, id))
    conn_likes.commit()
    return jsonify({'message': '点赞成功!'})

@app.route('/api/topics/<int:id>/likes', methods=['DELETE'])
def delete_like(id):
    username = request.json['username']
    c_likes.execute('DELETE FROM likes WHERE username=? AND topic_id=?', (username, id))
    conn_likes.commit()
    return jsonify({'message': '取消点赞成功!'})

@app.route('/api/topics/<int:id>/has_liked', methods=['GET'])
def has_liked(id):
    username = request.args.get('username')
    c_likes.execute('SELECT * FROM likes WHERE username=? AND topic_id=?', (username, id))
    like = c_likes.fetchone()
    if like:
        return jsonify({'has_liked': True})
    else:
        return jsonify({'has_liked': False})

@app.route('/api/topics/search', methods=['GET'])
def search_topic():
    keyword = request.args.get('keyword')
    c_articles.execute('SELECT * FROM topics WHERE title LIKE ? OR content LIKE ? OR description LIKE ?', ('%'+keyword+'%', '%'+keyword+'%', '%'+keyword+'%'))
    topics = c_articles.fetchall()
    topic_list = [{'id': topic[0], 'name': topic[1], 'content': topic[2], 'description': topic[3], 'author': topic[4]} for topic in topics]
    topic_list.reverse()
    return jsonify(topic_list)

@app.route('/api/accounts/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    if (c_users.execute('SELECT * FROM users WHERE username=?', (username,)).fetchone() is not None):
        return jsonify({'message': '用户名已存在!'})
    c_users.execute('INSERT INTO users (username, password) VALUES (?,?)', (username, password))
    conn_users.commit()
    return jsonify({'message': '注册成功!'})

@app.route('/api/accounts/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    c_users.execute('SELECT * FROM users WHERE username=? AND password=?', (username, password))
    user = c_users.fetchone()
    if user:
        return jsonify({'message': '登录成功!'})
    else:
        return jsonify({'message': '用户名或密码错误!'})

if __name__ == '__main__':
    app.run(debug=True)