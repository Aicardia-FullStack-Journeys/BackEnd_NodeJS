const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

const express = require('express');
const app = express();
const port = 3000;

// Data and file paths (assuming a `data` directory)
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');
const htmlFilePath = path.join(__dirname, 'todos.html');

// Load tasks from JSON file (or create an empty array if file doesn't exist)
let tasks = [];
try {
  const data = fs.readFileSync(tasksFilePath, 'utf8');
  tasks = JSON.parse(data);
} catch (err) {
  console.error('Error reading tasks.json:', err);
  tasks = []; // Initialize with an empty array if reading fails
}

// Middleware to parse JSON requests
app.use(express.json());

// API endpoints for managing tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = { id: Date.now(), task: req.body.text, completed: false };
  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = req.body.completed;
    saveTasks();
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/api/tasks', (req, res) => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  res.send('Completed tasks deleted');
});

// Helper function to save tasks to JSON file
function saveTasks() {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Error writing to tasks.json:', err);
  }
}

// Serve static HTML file (assuming todos.html exists in the root directory)
app.use(express.static(path.join(__dirname)));

// Handle requests for the root path (/) to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(htmlFilePath);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});