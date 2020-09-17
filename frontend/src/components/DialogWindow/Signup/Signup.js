import React, { useState, useContext } from "react";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import "./Signup.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";

const Signup = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);

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
        const res = await request(
            "post",
            "http://localhost:8000/users/signup",
            userState,
            true
        );

        if (res.data.status === "success") {
            const privateConvRes = await request(
                "get",
                "http://localhost:8000/conversations/private",
                null,
                true
            );
            const groupConvRes = await request(
                "get",
                "http://localhost:8000/conversations/group",
                null,
                true
            );
            userContext.updateGlobalUserState({
                user: res.data.data,
                privateConversations: privateConvRes.data.data,
                groupConversations: groupConvRes.data.data,
            });
            popupContext.closeDialogWindow();
            popupContext.setAlertActive(
                true,
                `Welcome to our community, ${res.data.data.name}!`
            );
            setUserState({
                name: "",
                email: "",
                password: "",
                passwordConfirm: "",
            });
        } else {
            popupContext.setAlertActive(true, "Something went wrong...");
            setUserState({
                ...userState,
                password: "",
                passwordConfirm: "",
            });
        }
    };

    return (
        <div id="Signup" className={props.className}>
            <h1>Sign up</h1>
            <img
                src={require("../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={popupContext.closeDialogWindow}
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
            <MyButton onClick={signup} className="button">
                Join the community
            </MyButton>
        </div>
    );
};

export default Signup;
