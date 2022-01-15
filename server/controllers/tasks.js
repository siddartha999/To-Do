const Tasks = require('../models/Tasks');
const { v4: uuidv4 } = require('uuid');
  

/**
 * Controller to create a new task for the current User.
 */
const createNewTask = async (req, res) => {
    const userId = req.userId;
    const data = req.body;
    const taskObj = {
        id: uuidv4(),
        task: data.task,
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
const retrieveTasks = async (req, res) => {
    const userId = req.userId;
    const skip = req.query?.skip - 0 || 0;
    const $sliceObj = {};
    $sliceObj.current = {
        $slice: skip === 0 ? (- 1 * skip) - 10 : [(-1 * skip) - 10, -skip - 10 + 10]
    };
    console.log($sliceObj);
    try {
        let userTasks = await Tasks.findOne({_id: userId}, $sliceObj).select("current").exec();
        return res.status(200).json({
            tasks: userTasks?.current.reverse()
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Unable to retrieve current tasks. Please try again."
        });
    }
};

module.exports.createNewTask = createNewTask;
module.exports.retrieveTasks = retrieveTasks;