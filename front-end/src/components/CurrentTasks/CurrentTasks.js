import React, { useState, useEffect, useRef, useContext } from 'react';
import './CurrentTasks.css';
import axios from 'axios';
import Input from '@mui/material/Input';
import AddIcon from '@mui/icons-material/Add';
import UserContext from '../../contexts/UserContext';
import SnackbarContext  from '../../contexts/SnackbarContext';

const CurrentTasks = () => {
    const {user, setUser} = useContext(UserContext);
    const [currentTasks, setCurrentTasks] = useState(null);
    const {raiseSnackbarMessage} = useContext(SnackbarContext);
    const inputRef = useRef(null);

    const token = user?.token;
    if(!token) {
        raiseSnackbarMessage('Unable to Authenticate the User. Please login again', 'error');
        localStorage.setItem("todouserinfo", null);
        setUser(null);
    }

    /**
     * Retrieve the current Tasks for the User
     */
    useEffect(async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/current',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCurrentTasks(response.data?.tasks);
            console.log(response.data?.tasks);
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
    }, []);

    /**
     * Handler to save the current task
     */
    const handleTaskSubmit = async () => {
        const task = inputRef.current.getElementsByTagName('input')[0].value;
        try {
            const response = await axios({
                method: 'POST',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    task: task
                }
            });
            raiseSnackbarMessage(response.data.message, 'success');
            inputRef.current.getElementsByTagName('input')[0].value = '';
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
        <div className='CurrentTasks'>
            <div className='CurrentTasks-add-task-wrapper'>
             <div className='CurrentTasks-add-task'>
                <Input ref={inputRef} />
             </div>
             <div className='CurrentTasks-add-icon'>
                <AddIcon onClick={handleTaskSubmit} />
             </div>
            </div>
            <div className='CurrentTasks-tasks-wrapper'>
                {
                    currentTasks && currentTasks.length &&
                    currentTasks.map((task, idx) => (
                        <div className='CurrentTasks-current-task' key={idx}>
                            <p>{task.task}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default CurrentTasks;