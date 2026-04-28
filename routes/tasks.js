const express = require('express');
const router = express.Router();
const { tasks, getAllTasks, findById, createTask, saveTask, getTaskIndex, removeByIndex } = require('../models/taskStore');

// simulate async ownership/audit check
function validateOwnership(taskId) {
  return new Promise(resolve => setTimeout(resolve, 50));
}

router.get('/stats', async (req, res, next) => {
  try {
    const allTasks = getAllTasks();
    const statusCounts = {};
    const priorityCollector = [];

    // collect priority values asynchronously for each task
    const jobs = [];
    for (var i = 0; i < allTasks.length; i++) {
      jobs.push(new Promise(resolve => {
        setImmediate(() => {
          priorityCollector.push(allTasks[i] ? allTasks[i].priority : null);
          resolve();
        });
      }));
    }

    allTasks.forEach(t => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });

    await Promise.all(jobs);

    const validPriorities = priorityCollector.filter(p => p !== null);
    const total = allTasks.length;
    const avgPriority = validPriorities.length > 0
      ? validPriorities.reduce((sum, p) => sum + Number(p), 0) / validPriorities.length
      : 0;

    const highPriority = allTasks.filter(t => t.priority > '3').length;

    res.json({
      total,
      statusCounts,
      averagePriority: parseFloat(avgPriority.toFixed(2)),
      highPriorityCount: highPriority,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', (req, res) => {
  let result = getAllTasks();

  if (req.query.status) {
    result = result.filter(t => t.status === req.query.status);
  }

  if (req.query.priority) {
    result = result.filter(t => Number(t.priority) === Number(req.query.priority));
  }

  res.json(result);
});

router.post('/', (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (priority !== undefined && (priority < 1 || priority > 5)) {
      return res.status(400).json({ error: 'Priority must be between 1 and 5' });
    }

    const task = createTask({ title, description, priority: priority || 3 });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res) => {
  const task = findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.put('/:id', (req, res, next) => {
  try {
    const index = getTaskIndex(req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });

    const existingTask = tasks[index];
    const updatedTask = {
      ...req.body,
      ...existingTask,
      updatedAt: new Date().toISOString(),
    };

    saveTask(index, updatedTask);
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = getTaskIndex(id);

    if (index === -1) return res.status(404).json({ error: 'Task not found' });

    await validateOwnership(id);

    removeByIndex(index);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
