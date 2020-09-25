import React, { useState, useContext } from "react";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import Loader from "../../Loader/Loader";
import "./Login.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";
import ThemeContext from "../../../utils/ThemeContext";
import KeyboardEventHandler from "react-keyboard-event-handler";

const Login = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);
    const theme = useContext(ThemeContext);

    const [userState, setUserState] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const field = event.target.name;
        const state = {
            ...userState,
        };
        state[field] = event.target.value;
        setUserState(state);
    };

    const login = async () => {
        setLoading(true);
        const res = await request(
            "post",
            `${process.env.REACT_APP_HOST}api/users/login`,
            userState,
            true
        );

        if (res.data.status === "success") {
            const privateConvRes = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/conversations/private`,
                null,
                true
            );
            const groupConvRes = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/conversations/group`,
                null,
                true
            );
            userContext.updateGlobalUserState({
                user: res.data.data,
                privateConversations: privateConvRes.data.data,
                groupConversations: groupConvRes.data.data,
                jwt: res.data.token,
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

            userContext.setMeInterval();
        } else {
            popupContext.setAlertActive(true, res.data.message);
            setUserState({
                ...userState,
                password: "",
            });
        }
        setLoading(false);
    };

    const close = () => {
        setUserState({
            email: "",
            password: "",
        });
        popupContext.closeDialogWindow();
    };

    return (
        <div
            id="Login"
            className={props.className}
            style={{
                backgroundColor: theme.colors.profile,
                color: theme.colors.primaryText,
            }}
        >
            <h1>Login</h1>
            <img
                src={require("../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={close}
                style={{ filter: theme.pngInvert() }}
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
            {loading ? <Loader /> : null}
            <KeyboardEventHandler
                handleKeys={["enter"]}
                handleFocusableElements={true}
                onKeyEvent={login}
            />
        </div>
    );
};

export default Login;
