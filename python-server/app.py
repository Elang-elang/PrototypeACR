from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from werkzeug.utils import secure_filename
import apsw
import os
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database Initialization
def init_db():
    conn = apsw.Connection("database/chat.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            filetype TEXT NOT NULL,
            filepath TEXT NOT NULL,
            sender TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    return conn

db_conn = init_db()

# Upload Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../client/public/uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1MB limit

# File Upload Endpoint
@app.route('/process-media', methods=['POST'])
def process_media():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "Empty filename"}), 400

    try:
        # Secure filename and save
        filename = secure_filename(file.filename)
        unique_filename = f"{int(time.time())}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        # Save to database
        cursor = db_conn.cursor()
        cursor.execute(
            "INSERT INTO media (filename, filetype, filepath, sender) VALUES (?, ?, ?, ?)",
            (filename, file.content_type, unique_filename, request.form.get('sender', 'anonymous'))
        )

        return jsonify({
            "status": "success",
            "url": f"/uploads/{unique_filename}",
            "filename": filename
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Socket.IO Events
@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)

if __name__ == '__main__':
    if not os.path.exists('database'):
        os.makedirs('database')
    socketio.run(app, port=5000, debug=True)