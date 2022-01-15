const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createNewTask, retrieveTasks } = require('../controllers/tasks');

//Create a new task.
router.post('/', auth, createNewTask);

//Retrieve Current tasks for the user.
router.get('/current', auth, retrieveTasks);

module.exports = router;