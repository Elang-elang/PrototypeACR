// DOM Elements  
const loginModal = document.getElementById('login-modal');  
const loginInput = document.getElementById('login-input');  
const loginBtn = document.getElementById('login-btn');  
const logoutBtn = document.getElementById('logout-btn');  
const usernameSpan = document.getElementById('username');  
const avatarLetter = document.getElementById('avatar-letter');  
const messageInput = document.getElementById('message-input');  
const sendBtn = document.getElementById('send-btn');  
const messagesDiv = document.getElementById('messages');  
const usersList = document.getElementById('users-list');  
const onlineCount = document.getElementById('online-count');  
const fileUpload = document.getElementById('file-upload');  
const mobileMenu = document.getElementById('mobile-menu');  
const sidebar = document.querySelector('.sidebar');  
const themeToggle = document.getElementById('theme-toggle');  
const body = document.body;  
const clearChat = document.getElementById('clear-chat');  
const emojiBtn = document.getElementById('emoji-btn');  
const emojiPicker = document.getElementById('emoji-picker');  
const emojiList = document.getElementById('emoji-list');  
const emojiCategories = document.querySelectorAll('.emoji-categories button');  
  
// State  
let darkTheme = true;  
let currentUser = 'Guest';  
let typingTimeout = null;  
let unreadCount = 0;  
  
// Socket.IO Client  
const socket = io();  
  
// Load emoji data  
const emojis = {  
  smileys: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕'],  
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🦘', '🦡', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦢', '🦉', '🦚', '🦜', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐚', '🐞', '🐜', '🦗', '🕷', '🕸', '🦂', '🦟', '🦠'],  
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥭', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🥬', '🌽', '🥕', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🥯', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🧁', '🍮', '🎂', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🍾'],
  activity: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🥍', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '⛸', '🥌', '🛷', '🛹', '🎿', '⛷', '🏂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '🏵', '🎗', '🎫', '🎟', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🎠', '⛲', '⛱', '🏖', '🏝', '🏜', '🌋', '⛰', '🏔', '🗻', '🏕', '⛺', '🏠', '🏡', '🏘', '🏚', '🏗', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪', '🕌', '🕍', '🕋', '⛩'],
  objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🗑', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '🧾', '💎', '⚖️', '🔧', '🔨', '⚒', '🛠', '⛏', '🔩', '⚙️', '⛓', '🧰', '🔫', '💣', '🧲', '🧪', '🧫', '🧬', '🧯', '🔬', '🔭', '📡', '💉', '💊', '🧴', '🧵', '🧶', '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🛎', '🔑', '🗝', '🚪', '🛋', '🛏', '🛌', '🧸', '🖼', '🛍', '🛒']
};

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
messageInput.addEventListener('input', handleTyping);
fileUpload.addEventListener('change', handleFileUpload);
mobileMenu.addEventListener('click', toggleSidebar);
themeToggle.addEventListener('click', toggleTheme);
clearChat.addEventListener('click', clearMessages);
emojiBtn.addEventListener('click', toggleEmojiPicker);
document.addEventListener('click', closeEmojiPicker);

// Initialize app
function init() {
  loadTheme();
  populateEmojis('smileys');
  setupEmojiCategories();
  checkLogin();
  
  // Socket events
  setupSocketEvents();
}

// Theme functions
function loadTheme() {
  const savedTheme = localStorage.getItem('neonChatTheme');
  if (savedTheme === 'light') {
    darkTheme = false;
    applyTheme();
  }
}

function toggleTheme() {
  darkTheme = !darkTheme;
  applyTheme();
  localStorage.setItem('neonChatTheme', darkTheme ? 'dark' : 'light');
}

function applyTheme() {
  if (darkTheme) {
    body.classList.remove('light-theme');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i><span>Switch Theme</span>';
  } else {
    body.classList.add('light-theme');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i><span>Switch Theme</span>';
  }
}

// User functions
function checkLogin() {
  const savedUsername = localStorage.getItem('neonChatUsername');
  if (savedUsername) {
    currentUser = savedUsername;
    completeLogin();
  }
}

function login() {
  let username = loginInput.value.trim();
  if (username) {
    if (username.length > 20) username = username.substring(0, 20);
    currentUser = username;
    localStorage.setItem('neonChatUsername', username);
    completeLogin();
    socket.emit('user joined', username);
  } else {
    shakeElement(loginInput);
  }
}

function completeLogin() {
  loginModal.style.display = 'none';
  usernameSpan.textContent = currentUser;
  avatarLetter.textContent = currentUser.charAt(0).toUpperCase();
  messageInput.focus();
}

function logout() {
  localStorage.removeItem('neonChatUsername');
  socket.emit('user left', currentUser);
  currentUser = 'Guest';
  loginModal.style.display = 'flex';
  loginInput.value = '';
  loginInput.focus();
}

// UI helpers
function shakeElement(element) {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), 500);
}

function toggleSidebar() {
  sidebar.classList.toggle('expanded');
}

function clearMessages() {
  messagesDiv.innerHTML = '';
  showSystemMessage('Chat cleared');
}

// Message functions
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText) {
    const messageData = {
      text: messageText,
      sender: currentUser,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('chat message', messageData);
    messageInput.value = '';
    messageInput.focus();
    socket.emit('stop typing', currentUser);
  }
}

function renderMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  
  const timestamp = new Date(message.timestamp);
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (message.isFile) {
    const [fileUrl, caption] = message.content.split('\n');
    messageDiv.innerHTML = `
      <span class="sender">${message.sender}</span>
      <a href="${fileUrl}" class="file-link" target="_blank" download="${message.originalName}">
        ${fileUrl.split('/').pop()}
      </a>
      <div class="text">${caption}</div>
      <span class="timestamp">${timeString}</span>
    `;
  } else {
    const sanitizedText = message.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    messageDiv.innerHTML = `
      <span class="sender">${message.sender}</span>
      <div class="text">${sanitizedText}</div>
      <span class="timestamp">${timeString}</span>
    `;
  }
  
  messagesDiv.appendChild(messageDiv);
  scrollToBottom();
}

function showSystemMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.style.backgroundColor = 'rgba(0, 255, 179, 0.1)';
  messageDiv.style.borderColor = 'var(--primary)';
  
  const timestamp = new Date();
  const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.innerHTML = `
    <span class="sender">System</span>
    <div class="text">${text}</div>
    <span class="timestamp">${timeString}</span>
  `;
  
  messagesDiv.appendChild(messageDiv);
  scrollToBottom();
}

function scrollToBottom() {
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

function handleTyping() {
  socket.emit('typing', currentUser);
  
  if (typingTimeout) clearTimeout(typingTimeout);
  
  typingTimeout = setTimeout(() => {
    socket.emit('stop typing', currentUser);
  }, 1000);
}

// File handling
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file || !currentUser || currentUser === 'Guest') return;

  if (file.size > 1 * 1024 * 1024) { // 1MB limit
    showSystemMessage('File size exceeds 1MB limit');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.url) {
      const message = {
        sender: currentUser,
        content: `${data.url}\n${currentUser}: Lihat ${data.originalName}`,
        isFile: true,
        fileUrl: data.url,
        originalName: data.originalName,
        timestamp: new Date().toISOString()
      };
      
      socket.emit('send-message', message);
    }
  } catch (err) {
    console.error('Upload error:', err);
    showSystemMessage('Failed to upload file');
  }
  e.target.value = '';
}

// User list functions
function updateUsersList(users) {
  usersList.innerHTML = '';
  onlineCount.textContent = users.length;
  
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
}

// Emoji picker functions
function toggleEmojiPicker(e) {
  e.stopPropagation();
  emojiPicker.classList.toggle('hidden');
}

function closeEmojiPicker(e) {
  if (!emojiPicker.classList.contains('hidden') && 
      !emojiPicker.contains(e.target) && 
      e.target !== emojiBtn) {
    emojiPicker.classList.add('hidden');
  }
}

function setupEmojiCategories() {
  emojiCategories.forEach(button => {
    button.addEventListener('click', () => {
      emojiCategories.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      populateEmojis(button.dataset.category);
    });
  });
}

function populateEmojis(category) {
  emojiList.innerHTML = '';
  
  emojis[category].forEach(emoji => {
    const span = document.createElement('span');
    span.className = 'emoji';
    span.textContent = emoji;
    span.addEventListener('click', () => {
      insertEmoji(emoji);
    });
    emojiList.appendChild(span);
  });
}

function insertEmoji(emoji) {
  const cursorPos = messageInput.selectionStart;
  const textBefore = messageInput.value.substring(0, cursorPos);
  const textAfter = messageInput.value.substring(cursorPos);
  
  messageInput.value = textBefore + emoji + textAfter;
  messageInput.selectionStart = cursorPos + emoji.length;
  messageInput.selectionEnd = cursorPos + emoji.length;
  messageInput.focus();
}

// Socket.IO event handlers
function setupSocketEvents() {
  socket.on('connect', () => {
    showSystemMessage('Connected to server');
  });
  
  socket.on('disconnect', () => {
    showSystemMessage('Disconnected from server');
  });
  
  socket.on('chat message', (msg) => {
    renderMessage(msg);
    
    // If window is not in focus, show notification
    if (document.hidden) {
      unreadCount++;
      updateTitle();
      showNotification(msg.sender, msg.text);
    }
  });
  
  socket.on('user joined', (username) => {
    showSystemMessage(`${username} has joined the chat`);
  });
  
  socket.on('user left', (username) => {
    showSystemMessage(`${username} has left the chat`);
  });
  
  socket.on('users list', (users) => {
    updateUsersList(users);
  });
  
  socket.on('typing', (username) => {
    if (username !== currentUser) {
      document.querySelector('.typing-indicator').classList.remove('hidden');
    }
  });
  
  socket.on('stop typing', () => {
    document.querySelector('.typing-indicator').classList.add('hidden');
  });
  
  socket.on('load-messages', (messages) => {
    messagesDiv.innerHTML = ''; // Kosongkan dulu
    messages.forEach(msg => renderMessage(msg));
    scrollToBottom();
  });
}

// Notifications
function updateTitle() {
  document.title = unreadCount > 0 ? `(${unreadCount}) Neon Chat` : 'Neon Chat';
}

function showNotification(sender, message) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('New Message from Neon Chat', {
      body: `${sender}: ${message}`,
      icon: '/favicon.ico'
    });
    
    notification.onclick = function() {
      window.focus();
      this.close();
    };
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

// Reset unread count when window gets focus
window.addEventListener('focus', () => {
  unreadCount = 0;
  updateTitle();
});

// Request notification permission
if ('Notification' in window) {
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    setTimeout(() => {
      Notification.requestPermission();
    }, 5000);
  }
}

// Add CSS animation class
const addAnimation = (element, animationClass, duration = 500) => {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
};

// Implement custom animation for message sent confirmation
sendBtn.addEventListener('click', () => {
  addAnimation(sendBtn, 'pulse', 300);
});