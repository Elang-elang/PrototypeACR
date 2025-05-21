const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Models
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, '../client/public')));

// Uploads Directory
const uploadDir = path.join(__dirname, '../client/public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// Upload Endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({ 
    url: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });
});

// Active users
const activeUsers = {};

// Socket.IO
io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);

  // Send chat history
  const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
  socket.emit('load-messages', messages);

  // Handle new user
  socket.on('set-username', async (username) => {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username, online: true });
      } else {
        user.online = true;
      }
      await user.save();

      activeUsers[socket.id] = username;
      socket.username = username;
      
      const onlineUsers = await User.find({ online: true });
      io.emit('update-users', onlineUsers.map(u => u.username));
      io.emit('users-list', Object.values(activeUsers));
      socket.broadcast.emit('user-joined', username);
    } catch (err) {
      console.error(err);
    }
  });

  // Handle messages
  socket.on('send-message', async (data) => {
    try {
      const newMessage = new Message({
        sender: data.sender,
        content: data.content,
        isFile: data.isFile || false,
        fileUrl: data.fileUrl || null,
        originalName: data.originalName || null,
        timestamp: new Date(data.timestamp)
      });

      await newMessage.save();
      io.emit('receive-message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Handle typing indicators
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stop-typing', (username) => {
    socket.broadcast.emit('stop-typing', username);
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    if (socket.username) {
      await User.updateOne(
        { username: socket.username },
        { $set: { online: false, lastSeen: new Date() } }
      );
      
      socket.broadcast.emit('user-left', socket.username);
      delete activeUsers[socket.id];
      
      const onlineUsers = await User.find({ online: true });
      io.emit('update-users', onlineUsers.map(u => u.username));
      io.emit('users-list', Object.values(activeUsers));
    }
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});