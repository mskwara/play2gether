import React, { useState, useContext } from "react";
import MyInput from "../MyInput/MyInput";
import "./Login.scss";
import axios from "axios";
import AlertContext from "../../utils/AlertContext";

const Login = (props) => {
    const alertContext = useContext(AlertContext);

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
            const res = await axios.post(
                "http://localhost:8000/users/login",
                userState,
                {
                    withCredentials: true,
                }
            );
            if (res.data.status === "success") {
                localStorage.setItem("userId", res.data.data.user._id);
                console.log(localStorage.getItem("userId"));
                props.closeLogin();
                alertContext.setAlertActive(
                    true,
                    `Welcome back, ${res.data.data.user.name}!`
                );
            }
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
