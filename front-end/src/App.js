import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserContext from './contexts/UserContext';
import Login from './components/Login/Login';

const App = () => {
  const userObj = JSON.parse(localStorage.getItem("todouserinfo"));
  const [user, setUser] = useState(userObj);

  const appFlow = (
    <>
      <div>
        TO DO app
      </div>
    </>
  );
  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        {
          user ?
              appFlow
              :
              <Login />
        }
      </UserContext.Provider>
    </div>
  );
}

export default App;
