const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory tasks للـ Lab دي (الـ DB هتيجي في Lab 4)
let tasks = [
{ id: 1, title: 'Learn Docker', done: false },
{ id: 2, title: 'Build TaskFlow', done: false },
{ id: 3, title: 'Deploy on K8s', done: false },
];

// Health check — K8s هيحتاجه لاحقاً
app.get('/health', (req, res) => {
res.json({ status: 'ok', version: '1.0.0' });
});

// GET all tasks
app.get('/tasks', (req, res) => {
res.json(tasks);
});

// POST new task
app.post('/tasks', (req, res) => {
const task = {
id: tasks.length + 1,
title: req.body.title,
done: false,
};
tasks.push(task);
res.status(201).json(task);
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
const task = tasks.find(t => t.id === parseInt(req.params.id));
if (!task) return res.status(404).json({ error: 'Task not found' });
task.done = req.body.done ?? task.done;
task.title = req.body.title ?? task.title;
res.json(task);
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`TaskFlow API running on port ${PORT}`);
});
