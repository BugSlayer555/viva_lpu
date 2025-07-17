const express = require('express');
const router = express.Router();

// Example: Dummy data (real me DB use karoge)
let tasks = [
  { id: 1, title: 'First Task', completed: false },
  { id: 2, title: 'Second Task', completed: true },
];

// 1. GET all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// 2. POST new task
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ msg: 'Task title is required' });
  }
  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 3. PUT update task by id
router.put('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, completed } = req.body;

  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ msg: 'Task not found' });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// 4. DELETE task by id
router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  res.json({ msg: 'Task deleted' });
});

module.exports = router;
