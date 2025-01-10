require('dotenv').config();

const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const port = 3000;

//MongoDB connections stuffies
const uri = process.env.DB_URI;

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('ERROR ON PROCESS: connecting to MongoDB:', err));


const todoSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false }
},{ timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);


app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});


app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'ERROR ON PROCESS: fetching todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { task } = req.body;
    const newTodo = new Todo({ task });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err); 
    res.status(500).json({ error: 'ERROR ON PROCESS: creating todo.' }); 
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Missing todo' });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'update failed, Todo' });
  }
});

app.delete('/todos', async (req, res) => { 
  try {
    await Todo.deleteMany({ completed: true }); 
    res.json({ message: 'Completed todos deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Deleting failed, Todo' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});