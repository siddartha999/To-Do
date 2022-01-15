import React, { useState, useEffect, useRef, useContext } from 'react';
import './CurrentTasks.css';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import UserContext from '../../contexts/UserContext';
import SnackbarContext  from '../../contexts/SnackbarContext';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const CurrentTasks = () => {
    const {user, setUser} = useContext(UserContext);
    const [currentTasks, setCurrentTasks] = useState(null);
    const {raiseSnackbarMessage} = useContext(SnackbarContext);
    const [inputVal, setInputVal] = useState('');
    const totalCount = useRef(null);
    const paginationCount = Math.ceil((totalCount.current ? totalCount.current : 0) / 10);
    const [paginationIndex, setPaginationIndex] = useState(1);

    const token = user?.token;
    if(!token) {
        raiseSnackbarMessage('Unable to Authenticate the User. Please login again', 'error');
        localStorage.setItem("todouserinfo", null);
        setUser(null);
    }

    /**
     * Retrieve the current Tasks for the User.
     */
    const retrieveTasks = async (offset) => {
        try {
            const response = await axios({
                method: 'GET',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/current?skip=' + (offset ? offset - 1 : 0),
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            totalCount.current = response.data?.total;
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
     * Retrieve the current Tasks for the User
     */
    useEffect(async () => {
        retrieveTasks();
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
            retrieveTasks();
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
        setPaginationIndex(value);
        retrieveTasks(value);
    };

    /**
     * Handler to keep track of the input state
     */
    const handleChange = (event) => {
        setInputVal(event.target.value.slice(0, 25));
    }

    /**
     * Handler to delete a task
     */
    const handleDelete = async (event) => {
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
                console.log(response.data.total);
                if(response.data.total % 10 == 0) {
                    setPaginationIndex(paginationIndex - 1);
                    retrieveTasks(paginationIndex - 1);
                }
                else {
                    retrieveTasks(paginationIndex);
                }
            }
            else {
                retrieveTasks();
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

    return (
        <div className='CurrentTasks'>
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
                            <div className='CurrentTasks-delete-wrapper' title='Delete Task' taskid={task.id} onClick={handleDelete}>
                                <DeleteIcon  />
                            </div>
                            <div className='CurrentTasks-check-wrapper' title='Mark Complete'>
                                <CheckIcon />
                            </div>
                            <div className='CurrentTasks-star-wrapper' title='Star'>
                                <StarOutlineIcon />
                            </div>
                        </div>
                    ))
                    : null
                }
            </div>

            {
                totalCount.current && totalCount.current > 0 ? 
                    <div className="CurrentTasks-pagination-wrapper">
                        <Pagination count={paginationCount} page={paginationIndex} onChange={handlePaginationChange} 
                            variant="outlined" color="primary" />  
                    </div> 
                    : null
            }
        </div>
    );
};

export default CurrentTasks;