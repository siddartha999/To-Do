import React, { useContext } from 'react';
import './Login.css';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import UserContext from '../../contexts/UserContext';

const Login = () => {
    const {user, setUser} = useContext(UserContext);
    const responseGoogle = (res) => {
        axios({
            method: "POST",
            url: process.env.REACT_APP_SERVER_URL + "/api/login/googlelogin",
            data: {tokenId: res.tokenId}
        }).then(response => {
            if(response.status === 400) {
                //alert(response.data.error);
            }
            else {
                const userObj = {
                    token: response.data.token,
                    profile: response.data.user
                };
                localStorage.setItem("todouserinfo", JSON.stringify(userObj));
                setUser(userObj);
            }
        });
    };

    const responseFailureGoogle = (res) => {
        alert('Unable to Login via Google OAUTH. Please try again!', res);
        console.log(res);
    };

    return(
       <div className="Login">
           <div className="Login-wrapper">
                <div className="Login-header">
                    <div className="Login-header-title-wrapper">
                            <p className="Login-header-title">To Do</p>
                    </div>
                        <p className="Login-header-caption">A space to track all your tasks</p>
                </div>
                <div className="Login-types-wrapper">
                    <div className="Login-google" title='Google Login'>
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="Continue with Google"
                            onSuccess={responseGoogle}
                            onFailure={responseFailureGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
           </div>
       </div>
    );
}

export default Login;