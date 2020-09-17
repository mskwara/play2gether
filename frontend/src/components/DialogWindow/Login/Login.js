import React, { useState, useContext } from "react";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import "./Login.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";

const Login = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);

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
        const res = await request(
            "post",
            "http://localhost:8000/users/login",
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
                `Welcome back, ${res.data.data.name}!`
            );
            setUserState({
                email: "",
                password: "",
            });
        } else {
            popupContext.setAlertActive(true, res.data.message);
            setUserState({
                ...userState,
                password: "",
            });
        }
    };

    return (
        <div id="Login" className={props.className}>
            <h1>Login</h1>
            <img
                src={require("../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={popupContext.closeDialogWindow}
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
            <MyButton onClick={login}>Log me in</MyButton>
        </div>
    );
};

export default Login;
