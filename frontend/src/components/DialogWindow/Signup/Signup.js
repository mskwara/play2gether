import React, { useState, useContext } from "react";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import Loader from "../../Loader/Loader";
import "./Signup.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";
import ThemeContext from "../../../utils/ThemeContext";
import KeyboardEventHandler from "react-keyboard-event-handler";

const Signup = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);
    const theme = useContext(ThemeContext);

    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
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

    const signup = async () => {
        setLoading(true);
        const res = await request(
            "post",
            `${process.env.REACT_APP_HOST}api/users/signup`,
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
                `Welcome to our community, ${res.data.data.name}!`
            );
            setUserState({
                name: "",
                email: "",
                password: "",
                passwordConfirm: "",
            });

            userContext.setMeInterval();
        } else {
            popupContext.setAlertActive(true, "Something went wrong...");
            setUserState({
                ...userState,
                password: "",
                passwordConfirm: "",
            });
        }
        setLoading(false);
    };

    const close = () => {
        setUserState({
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
        });
        popupContext.closeDialogWindow();
    };

    return (
        <div
            id="Signup"
            className={props.className}
            style={{
                backgroundColor: theme.colors.profile,
                color: theme.colors.primaryText,
            }}
        >
            <h1>Sign up</h1>
            <img
                src={require("../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={close}
                style={{ filter: theme.pngInvert() }}
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
            {loading ? <Loader /> : null}
            <KeyboardEventHandler
                handleKeys={["enter"]}
                handleFocusableElements={true}
                onKeyEvent={signup}
            />
        </div>
    );
};

export default Signup;
