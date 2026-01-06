require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Public config to share with frontend
const publicConfig = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
  }
};


let chatLogs = [];
const USERS_FILE = path.join(__dirname, 'users.json');
const AUTH_LOGS_FILE = path.join(__dirname, 'auth_logs.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(AUTH_LOGS_FILE)) {
  fs.writeFileSync(AUTH_LOGS_FILE, JSON.stringify([]));
}

const getUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

const getAuthLogs = () => {
  try {
    const data = fs.readFileSync(AUTH_LOGS_FILE, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading auth logs file:', err);
    return [];
  }
};

const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
const saveAuthLogs = (logs) => fs.writeFileSync(AUTH_LOGS_FILE, JSON.stringify(logs, null, 2));

const addAuthLog = (type, email, name) => {
  const logs = getAuthLogs();
  logs.push({
    type,
    email,
    name,
    timestamp: new Date().toISOString()
  });
  saveAuthLogs(logs);
};

// API Routes
const apiRouter = express.Router();

apiRouter.get('/status', (req, res) => {
  res.json({ message: 'OK' });
});

apiRouter.get('/config', (req, res) => {
  res.json(publicConfig);
});

apiRouter.post('/chat/log', (req, res) => {
  const { sender, message, timestamp } = req.body;
  chatLogs.push({ sender, message, timestamp: timestamp || new Date().toISOString() });
  res.status(201).json({ status: 'logged' });
});

apiRouter.get('/chat/logs', (req, res) => {
  res.json(chatLogs);
});

apiRouter.post('/auth/log', (req, res) => {
  const { type, email, name, timestamp } = req.body;
  const logs = getAuthLogs();
  logs.push({ type, email, name, timestamp: timestamp || new Date().toISOString() });
  saveAuthLogs(logs);
  res.status(201).json({ status: 'logged' });
});

apiRouter.get('/auth/logs', (req, res) => {
  res.json(getAuthLogs());
});

apiRouter.post('/auth/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  const { name, email, password } = req.body;
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: Date.now().toString(), name, email, password };
  users.push(newUser);
  saveUsers(users);

  addAuthLog('SIGNUP', email, name);

  res.status(201).json({ message: 'User created', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

apiRouter.post('/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  addAuthLog('LOGIN', email, user.name);

  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

// Register API router
app.use('/api', apiRouter);

// Specific routes for HTML files
app.get('/monitor', (req, res) => {
  res.sendFile(path.join(__dirname, 'monitor.html'));
});

// Serve index.html for all other GET requests (SPA fallback)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/monitor') {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  next();
});

// JSON Error Handler for API
app.use('/api', (err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`URL: http://localhost:${port}`);
  console.log(`Monitor: http://localhost:${port}/monitor`);
});
