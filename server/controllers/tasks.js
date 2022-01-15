const Tasks = require('../models/Tasks');
const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');
  

/**
 * Controller to create a new task for the current User.
 */
const createNewTask = async (req, res) => {
    const userId = req.userId;
    const data = req.body;
    const taskObj = {
        id: uuidv4(),
        task: data.task.slice(0, 25),
        isStarred: false,
        isCompleted: false,
        lastUpdated: Date.now(),
    };
    try {
        let userTasks = await Tasks.findById(userId).exec();
        if(!userTasks) {
            userTasks = new Tasks({_id: userId});
            userTasks.current = [];
        }
        userTasks.current.push(taskObj);
        userTasks.currentCount = userTasks.current.length;
        userTasks.save();
        return res.status(200).json({
            message: "Task created successfully"
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Unable to create a new task. Please try again."
        });
    }
};

/**
 * Controller to retrieve current tasks for the User.
 */
const retrieveCurrentTasks = async (req, res) => {
    const userId = req.userId;
    const skip = (req.query?.skip - 0 || 0) * 10;
    try {
        let tasksSize = await Tasks.findById(userId).select("currentCount").exec();
        let userTasks = await Tasks.findById(userId).slice('current', skip === 0 ? - 10 : [(-1 * skip) - 10, tasksSize.currentCount - (skip * 1)]).exec();
        return res.status(200).json({
            tasks: userTasks?.current.reverse(),
            total: tasksSize.currentCount
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Unable to retrieve current tasks. Please try again."
        });
    }
};


/**
 * Controller to delete a current task.
 */
const deleteCurrentTask = async (req, res) => {
    const userId = req.userId;
    const data = req.body;
    const taskId = data.taskId;
    try {
        let $pull = {};
        $pull = {
            current: {
                id: taskId
            }
        };
        await Tasks.findByIdAndUpdate(userId, {
            $pull: {
                current: {
                    id: taskId
                }
            }
        }).exec();
        
        let userTask = await Tasks.findById(userId).select("currentCount").exec();
        userTask.currentCount--;
        userTask.save();
        return res.status(200).json({
            message: "A current task has been successfully deleted",
            total: userTask.currentCount
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Unable to delete the task. Please try again later."
        });
    }
};

module.exports.createNewTask = createNewTask;
module.exports.retrieveCurrentTasks = retrieveCurrentTasks;
module.exports.deleteCurrentTask = deleteCurrentTask;