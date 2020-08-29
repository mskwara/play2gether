import React, { useState, useContext } from "react";
import MyInput from "../MyInput/MyInput";
import "./Signup.scss";
import axios from "axios";
import AlertContext from "../../utils/AlertContext";

const Signup = (props) => {
    const alertContext = useContext(AlertContext);

    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const handleInputChange = (event) => {
        const field = event.target.name;
        const state = {
            ...userState,
        };
        state[field] = event.target.value;
        setUserState(state);
    };

    const signup = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/users/signup",
                userState,
                {
                    withCredentials: true,
                }
            );
            if (res.data.status === "success") {
                localStorage.setItem("userId", res.data.data.user._id);
                console.log(localStorage.getItem("userId"));
                props.closeSignup();
                alertContext.setAlertActive(
                    true,
                    `Welcome to our community, ${res.data.data.user.name}!`
                );
            }
        } catch (err) {
            console.log(err);
        }
        setUserState({
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
        });
    };

    return (
        <div id="Signup" className={props.className}>
            <div className="form">
                <h1>Sign up</h1>
                <img
                    src={require("../../assets/close.png")}
                    alt="close"
                    className="close-btn"
                    onClick={props.closeSignup}
                />
                <MyInput
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={userState.name}
                    labelId="signup"
                    handleInputChange={handleInputChange}
                />
                <MyInput
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={userState.email}
                    labelId="signup"
                    handleInputChange={handleInputChange}
                />
                <MyInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userState.password}
                    labelId="signup"
                    handleInputChange={handleInputChange}
                />
                <MyInput
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirm the password"
                    value={userState.passwordConfirm}
                    labelId="signup"
                    handleInputChange={handleInputChange}
                />
                <button onClick={signup}>Join the community</button>
            </div>
        </div>
    );
};

export default Signup;