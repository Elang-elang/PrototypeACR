# Real-Time Chat Application 💬

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-FFBF00)](https://socket.io/)

A modern real-time chat application with multimedia sharing, authentication, and cross-platform support.

## ✨ Features
- Real-time messaging with Socket.IO
- File/Image sharing (max 2MB)
- User authentication & authorization
- Multiple chat rooms
- Light/dark theme toggle
- Message history persistence
- Responsive design

## 📂 Directory Structure
```
PrototypeACR/
├── node-server/       # Node.js backend (Chat logic & MongoDB)
├── python-server/     # Python backend (File processing & SQLite)
├── client/            # Frontend (HTML/CSS/JS)
│   └── public/
├── DB/                # Database files
├── uploads/           # Uploaded files storage
└── docker-compose.yml # Docker config (optional)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x
- Python 3.10+
- MongoDB
- Git

### Installation
1. Clone repository:
```bash
git clone https://github.com/Elang-elang/PrototypeACR.git
cd PrototypeACR
```

2. Install dependencies:
```bash
# Node.js server
cd node-server
npm install

# Python server
cd ../python-server
pip install -r requirements.txt
```

### Running the App
1. Start MongoDB:
```bash
mongod --dbpath=/path/to/data
```

2. Start Node.js server:
```bash
cd node-server
node server.js
```

3. Start Python server:
```bash
cd ../python-server
python app.py
```

4. Open in browser: `http://localhost:3000`

## 🔧 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: 
  - Node.js (Express, Socket.IO, MongoDB)
  - Python (Flask, Flask-SocketIO, APSW/SQLite)
- **Database**: MongoDB (User data), SQLite (File metadata)
- **Auth**: Session-based with password hashing
- **Deployment**: Docker-ready (see docker-compose.yml)

## 🌟 Why This Project?
- Hybrid architecture combining Node.js and Python strengths
- Optimized for both text and media communication
- Clean and modern UI with theme support
- Perfect for learning real-time systems and full-stack development

---
