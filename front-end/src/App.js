import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserContext from './contexts/UserContext';
import ScreenWidthContext from './contexts/ScreenWidthContext';
import SnackbarContext from './contexts/SnackbarContext';
import Login from './components/Login/Login';
import ButtonAppBar from './components/AppBar/AppBar';
import CurrentTasks from './components/CurrentTasks/CurrentTasks';
import SnackBar from './components/Snackbar/Snackbar';

const App = () => {
  const userObj = JSON.parse(localStorage.getItem("todouserinfo"));
  const [width, setWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(userObj);
  const [snackbarOpen, toggleSnackbar] = useState(false);
  const snackbarObj = useRef(null);

  /**
   * Handler to invoke the snackbar with the message & severity provided.
   */
  const raiseSnackbarMessage = (message, severity) => {
  snackbarObj.current = {}; 
  snackbarObj.current.severity = severity;
  snackbarObj.current.message = message;
  toggleSnackbar(true);
  };

  /**
   * useEffect for initial-setup to add an event listener that tracks the current screen's width on resize.
   */
   useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });
  }, []);

  const appFlow = (
    <>
      <ButtonAppBar />
      <div className="App-body">
        <div className='App-Tasks-wrapper'>
          <CurrentTasks />
        </div>
      </div>
    </>
  );
  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <ScreenWidthContext.Provider value={width}>
          <SnackbarContext.Provider value={{snackbarOpen, toggleSnackbar, snackbarObj, raiseSnackbarMessage}}>
            {
              user ?
                  appFlow
                  :
                  <Login />
            }
            <SnackBar />
          </SnackbarContext.Provider>
        </ScreenWidthContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
