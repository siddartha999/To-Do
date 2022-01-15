const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createNewTask, retrieveCurrentTasks, deleteCurrentTask } = require('../controllers/tasks');

//Create a new task.
router.post('/', auth, createNewTask);

//Retrieve Current tasks for the user.
router.get('/current', auth, retrieveCurrentTasks);

//Delete a task.
router.delete('/current', auth, deleteCurrentTask);

module.exports = router;