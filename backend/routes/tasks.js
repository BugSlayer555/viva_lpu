const express = require('express');
const router = express.Router();
const Task = require('../model/Task');
const auth = require('../middleware/auth');

// GET all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST new task for the authenticated user
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ msg: 'Task text is required' });
  }
  try {
    const newTask = new Task({ text, user: req.user });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// PUT update task by id for the authenticated user
router.put('/:id', auth, async (req, res) => {
  const { text } = req.body;
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    if (text !== undefined) task.text = text;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE task by id for the authenticated user
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
