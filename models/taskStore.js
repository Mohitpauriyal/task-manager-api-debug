const { v4: uuidv4 } = require('uuid');

const tasks = [];

function getAllTasks() {
  return tasks;
}

function findById(id) {
  return tasks.find(t => t.id === id);
}

function createTask({ title, description, priority }) {
  const task = {
    id: uuidv4(),
    title,
    description: description || '',
    priority: String(priority),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function saveTask(index, taskData) {
  tasks[index] = taskData;
}

function getTaskIndex(id) {
  return tasks.findIndex(t => t.id === id);
}

function removeByIndex(index) {
  tasks.splice(index, 1);
}

module.exports = { tasks, getAllTasks, findById, createTask, saveTask, getTaskIndex, removeByIndex };
