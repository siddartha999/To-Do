import React, { useState, useEffect, useRef, useContext } from 'react';
import './Tasks.css';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import UserContext from '../../contexts/UserContext';
import SnackbarContext  from '../../contexts/SnackbarContext';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneIcon from '@mui/icons-material/Done';
import ScreenWidthContext from '../../contexts/ScreenWidthContext';

const Tasks = () => {
    const {user, setUser} = useContext(UserContext);
    const [currentTasks, setCurrentTasks] = useState(null);
    const width = useContext(ScreenWidthContext);
    const [completedTasks, setCompletedTasks] = useState(null);
    const {raiseSnackbarMessage} = useContext(SnackbarContext);
    const [inputVal, setInputVal] = useState('');
    const currentTotalCount = useRef(null);
    const currentPaginationCount = Math.ceil((currentTotalCount.current ? currentTotalCount.current : 0) / 10);
    const [currentPaginationIndex, setCurrentPaginationIndex] = useState(1);

    const completedTotalCount = useRef(null);
    const completedPaginationCount = Math.ceil((completedTotalCount.current ? completedTotalCount.current : 0) / 10);
    const [completedPaginationIndex, setCompletedPaginationIndex] = useState(1);

    const token = user?.token;
    if(!token) {
        raiseSnackbarMessage('Unable to Authenticate the User. Please login again', 'error');
        localStorage.setItem("todouserinfo", null);
        setUser(null);
    }

    /**
     * Retrieve the current Tasks for the User.
     */
    const retrieveCurrentTasks = async (offset) => {
        try {
            const response = await axios({
                method: 'GET',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/current?skip=' + (offset ? offset - 1 : 0),
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            currentTotalCount.current = response.data?.total;
            setCurrentTasks(response.data?.tasks);
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };

    /**
     * Retrieve completed tasks for the current User.
     */
    const retrieveCompletedTasks = async (offset) => {
        try {
            const response = await axios({
                method: 'GET',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/completed?skip=' + (offset ? offset - 1 : 0),
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            completedTotalCount.current = response.data?.total;
            setCompletedTasks(response.data?.tasks);
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };

    /**
     * Retrieve the current Tasks for the User
     */
    useEffect(async () => {
        retrieveCurrentTasks();
        retrieveCompletedTasks();
    }, []);

    /**
     * Handler to save the current task
     */
    const handleTaskSubmit = async () => {
        try {
            const response = await axios({
                method: 'POST',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    task: inputVal
                }
            });
            retrieveCurrentTasks();
            raiseSnackbarMessage(response.data.message, 'success');
            setInputVal('');
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };

    /**
     * Handler to paginate.
     */
     const handlePaginationChange = (event, value) => {
        setCurrentPaginationIndex(value);
        retrieveCurrentTasks(value);
    };

    /**
     * Handler to keep track of the input state
     */
    const handleChange = (event) => {
        setInputVal(event.target.value.slice(0, 25));
    }

    /**
     * Handler to delete a current task
     */
    const handleCurrentDelete = async (event) => {
        //console.log(event.currentTarget.getAttribute("taskid"));
        try {
            const response = await axios({
                method: 'DELETE',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/current',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    taskId: event.currentTarget.getAttribute("taskid")
                }
            });
            if(response.data.total) {
                if(response.data.total % 10 === 0) {
                    setCurrentPaginationIndex(currentPaginationIndex - 1);
                    retrieveCurrentTasks(currentPaginationIndex - 1);
                }
                else {
                    retrieveCurrentTasks(currentPaginationIndex);
                }
            }
            else {
                retrieveCurrentTasks();
            }
            raiseSnackbarMessage(response.data.message, 'success');
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };


    /**
     * Handler to delete a Completed task.
     */
    const handleCompletedDelete = async (event) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/completed',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    taskId: event.currentTarget.getAttribute("taskid")
                }
            });
            if(response.data.total) {
                if(response.data.total % 10 === 0) {
                    setCompletedPaginationIndex(completedPaginationIndex - 1);
                    retrieveCompletedTasks(completedPaginationIndex - 1);
                }
                else {
                    retrieveCompletedTasks(completedPaginationIndex);
                }
            }
            else {
                retrieveCompletedTasks();
            }
            raiseSnackbarMessage(response.data.message, 'success');
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };

    /**
     * Submit the task on Enter
     */
    const handleSubmit = (event) => {
        if(event.keyCode === 13) {
            handleTaskSubmit();
        }
    };

    /**
     * Handler to mark the task as completed.
     */
    const handleCompleted = async (event) => {
        try {
            const response = await axios({
                method: 'PATCH',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/toggleCurrentComplete',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    taskId: event.currentTarget.getAttribute("taskid"),
                    taskType: 'current',
                    task: event.currentTarget.getAttribute("task")
                }
            });
            raiseSnackbarMessage(response.data.message, 'success');
            if(response.data.currentCount) {
                if(response.data.currentCount % 10 === 0) {
                    setCurrentPaginationIndex(currentPaginationIndex - 1);
                    retrieveCurrentTasks(currentPaginationIndex - 1);
                }
                else {
                    retrieveCurrentTasks(currentPaginationIndex);
                }
            }
            else {
                retrieveCurrentTasks();
            }
            retrieveCompletedTasks();
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };

    /**
     * Handler to undo the task as completed.
     */
    const handleUndoCompleted = async (event) => {
        try {
            const response = await axios({
                method: 'PATCH',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/toggleCurrentComplete',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    taskId: event.currentTarget.getAttribute("taskid"),
                    taskType: 'completed',
                    task: event.currentTarget.getAttribute("task")
                }
            });
            raiseSnackbarMessage(response.data.message, 'success');
            if(response.data.completedCount) {
                if(response.data.completedCount % 10 === 0) {
                    setCompletedPaginationIndex(completedPaginationIndex - 1);
                    retrieveCompletedTasks(completedPaginationIndex - 1);
                }
                else {
                    retrieveCompletedTasks(completedPaginationIndex);
                }
            }
            else {
                retrieveCompletedTasks();
            }
            retrieveCurrentTasks();
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    };

    return (
        <div className={`Tasks-wrapper ${width < 400 ? 'mobile400' : width < 750 ? 'mobile750' : null}`}>
            <div className='CurrentTasks'>
                <p>Current</p>
                <div className='CurrentTasks-add-task-wrapper'>
                    <div className='CurrentTasks-length-info'>
                        <p>{inputVal.length} / 25</p>
                    </div>
                    <div className='CurrentTasks-add-task'>
                        <TextField variant="standard" value={inputVal} onChange={handleChange} onKeyDown={handleSubmit} />
                    </div>
                    <div className='CurrentTasks-add-icon'>
                        <AddIcon onClick={handleTaskSubmit} />
                    </div>
                </div>
                <div className='CurrentTasks-tasks-wrapper'>
                    
                        {
                            currentTasks && currentTasks.length ?
                            currentTasks.map((task, idx) => (
                                <div className='CurrentTasks-current-task-wrapper' key={idx}>
                                    <p className='CurrentTasks-current-task'>{task.task}</p>
                                    <div className='CurrentTasks-delete-wrapper' title='Delete Task' taskid={task.id} onClick={handleCurrentDelete}>
                                        <DeleteIcon  />
                                    </div>
                                    <div className='CurrentTasks-check-wrapper' title='Mark as complete' taskid={task.id} onClick={handleCompleted}
                                    task={task.task}>
                                        <CheckCircleOutlineIcon />
                                    </div>
                                </div>
                            ))
                            :
                            <p className='No-results'>No Current tasks to display</p>
                        }
                    
                </div>

                {
                    currentTotalCount.current && currentTotalCount.current > 0 ? 
                        <div className="CurrentTasks-pagination-wrapper">
                            <Pagination count={currentPaginationCount} page={currentPaginationIndex} onChange={handlePaginationChange} 
                                variant="outlined" color="primary" />  
                        </div> 
                        : null
                }
            </div>

            <div className='CompletedTasks'>
                <p>Completed</p>
                <div className='CompletedTasks-tasks-wrapper'>
                    {
                        completedTasks && completedTasks.length ?
                        completedTasks.map((task, idx) => (
                            <div className='CompletedTasks-current-task-wrapper' key={idx}>
                                <p className='CompletedTasks-current-task'>{task.task}</p>
                                <div className='CompletedTasks-delete-wrapper' title='Delete Task' taskid={task.id} onClick={handleCompletedDelete}>
                                    <DeleteIcon  />
                                </div>
                                <div className='CompletedTasks-check-wrapper' title='Undo complete' taskid={task.id} onClick={handleUndoCompleted}
                                task={task.task}>
                                    <DoneIcon />
                                </div>
                            </div>
                        ))
                        :
                        <p className='No-results'>No Completed tasks to display</p>
                    }
                </div>

                {
                    completedTotalCount.current && completedTotalCount.current > 0 ? 
                        <div className="CurrentTasks-pagination-wrapper">
                            <Pagination count={completedPaginationCount} page={completedPaginationIndex} onChange={handlePaginationChange} 
                                variant="outlined" color="primary" />  
                        </div> 
                        : null
                }
            </div>
        </div>
    );
};

export default Tasks;