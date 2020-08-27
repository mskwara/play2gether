import React, { useState } from "react";
import MyInput from "../MyInput/MyInput";
import "./Login.scss";
import axios from "axios";

const Login = (props) => {
    const [userState, setUserState] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (event) => {
        const field = event.target.name;
        const state = {
            ...userState,
        };
        state[field] = event.target.value;
        setUserState(state);
    };

    const login = async () => {
        try {
            await axios.post("http://localhost:8000/users/login", userState);
        } catch (err) {
            console.log(err);
        }
        setUserState({
            email: "",
            password: "",
        });
    };

    return (
        <div id="Login" className={props.className}>
            <div className="form">
                <h1>Login</h1>
                <img
                    src={require("../../assets/close.png")}
                    alt="close"
                    className="close-btn"
                    onClick={props.closeLogin}
                />
                <MyInput
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={userState.email}
                    labelId="login"
                    handleInputChange={handleInputChange}
                />
                <MyInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userState.password}
                    labelId="login"
                    handleInputChange={handleInputChange}
                />
                <button onClick={login}>Log me in</button>
            </div>
        </div>
    );
};

export default Login;
