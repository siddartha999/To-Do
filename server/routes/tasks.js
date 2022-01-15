const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createNewTask, retrieveCurrentTasks, deleteCurrentTask, 
    toggleCurrentCompletedTasks, retrieveCompletedTasks, deleteCompletedTask } = require('../controllers/tasks');

//Create a new task.
router.post('/', auth, createNewTask);

//Retrieve Current tasks for the user.
router.get('/current', auth, retrieveCurrentTasks);

//Retrieve Completed tasks for the User.
router.get('/completed', auth, retrieveCompletedTasks);

//Delete a current task.
router.delete('/current', auth, deleteCurrentTask);

//Delete a completed task.
router.delete('/completed', auth, deleteCompletedTask);

//Toggle between Current and Complete.
router.patch('/toggleCurrentComplete', auth, toggleCurrentCompletedTasks);

module.exports = router;