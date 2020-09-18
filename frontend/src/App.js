import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import Game from "./views/Game/Game";
import Topbar from "./components/Topbar/Topbar";
import Loader from "./components/Loader/Loader";
import FriendList from "./components/FriendList/FriendList";
import Conversations from "./components/Conversations/Conversations";
import Alert from "./components/Alert/Alert";
import DialogWindow from "./components/DialogWindow/DialogWindow";
import PopupContext from "./utils/PopupContext";
import UserContext from "./utils/UserContext";
import ConvContext from "./utils/ConvContext";
import SocketContext from "./utils/SocketContext";
import ThemeContext from "./utils/ThemeContext";
import PrivateRoute from "./utils/PrivateRoute";
import "./App.scss";
import request from "./utils/request";
import io from "socket.io-client";
import Radium from "radium";

const App = (props) => {
    const themes = {
        light: {
            primary: "rgb(66, 44, 92)",
            primaryLight: "#8a71a8",
            primaryHover: "rgb(97, 66, 138)",
            border: "#666666",
            label: "rgb(66, 66, 66)",
            message: "#75529e",
            othersMessage: "rgb(226, 226, 226)",
            comment: "rgb(213, 219, 224)",
            commentHover: "rgb(232, 236, 240)",
            body: "white",
            topbarBorder: "#5a1a70",
            topbar: "rgb(97, 66, 138)",
            primaryText: "black",
            description: "white",
            profile: "white",
            friends: "rgba(48, 48, 48, 0.95)",
            settings: "white",
            chat: "white",
        },
        dark: {
            primary: "rgb(66, 44, 92)",
            primaryLight: "#8a71a8",
            primaryHover: "rgb(97, 66, 138)",
            border: "rgb(48, 48, 48)",
            label: "#d9d9d9",
            message: "rgb(66, 44, 92)",
            othersMessage: "#212121",
            comment: "#383838",
            commentHover: "#424242",
            body: "#212121",
            topbarBorder: "black",
            topbar: "#0f0f0f",
            primaryText: "white",
            description: "#121212",
            profile: "#1a1a1a",
            friends: "rgba(15, 15, 15, 0.95)",
            settings: "#0f0f0f",
            chat: "#0f0f0f",
        },
    };

    const [themeState, setThemeState] = useState("dark");

    if (themeState === "dark") {
        document.body.style = `background: ${themes.dark.body}`;
    } else {
        document.body.style = `background: ${themes.light.body}`;
    }

    const pngInvert = () => {
        if (themeState === "dark") {
            return "invert(1) hue-rotate(180deg)";
        } else {
            return "none";
        }
    };

    const [state, setState] = useState({
        dialogWindowActive: false,
        dialogWindowComponent: "",
        friendsOpened: false,
        group: false,
        profileOpened: false,
        profileUserId: null,
        alertActive: false,
        alertMessage: "",
    });

    const [loadingState, setLoadingState] = useState({ loading: true });

    const [globalUserState, setGlobalUserState] = useState({
        user: null,
        privateConversations: [],
        groupConversations: [],
        jwt: null,
    });

    const [convState, setConvState] = useState({
        openedConvs: [],
    });

    const [socketState, setSocketState] = useState({
        socket: null,
    });

    const updateGlobalUserState = (updatedFields) => {
        setGlobalUserState((globalUserState) => ({
            ...globalUserState,
            ...updatedFields,
        }));
    };

    const updateConvState = (updatedFields) => {
        setConvState((convState) => ({
            ...convState,
            ...updatedFields,
        }));
    };

    const [timeoutState, setTimeoutState] = useState();
    useEffect(() => {
        const checkLogin = async () => {
            const res = await request(
                "get",
                "http://localhost:8000/users/me",
                null,
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
                updateGlobalUserState({
                    user: res.data.data,
                    privateConversations: privateConvRes.data.data,
                    groupConversations: groupConvRes.data.data,
                    jwt: res.data.token,
                });
            } else {
                updateGlobalUserState({
                    user: null,
                    privateConversations: [],
                    groupConversations: [],
                });
            }
            setLoadingState({ loading: false });
        };

        const socket = io.connect("http://localhost:8000");
        setSocketState((socketState) => ({ ...socketState, socket }));
        checkLogin();
    }, []);

    window.onscroll = () => {
        scrollFunction();
    };

    const scrollFunction = () => {
        if (
            document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50
        ) {
            document.getElementById("Topbar").classList.remove("normal");
            document.getElementById("Topbar").classList.add("small");
        } else {
            document.getElementById("Topbar").classList.remove("small");
            document.getElementById("Topbar").classList.add("normal");
        }
    };

    const openDialogWindow = (component, obj) => {
        setState((state) => ({
            ...state,
            dialogWindowActive: true,
            dialogWindowComponent: component,
            ...obj,
        }));
    };

    const setFriendsOpened = (val, group = false) => {
        setState((state) => ({
            ...state,
            friendsOpened: val,
            group,
        }));
    };

    const closeDialogWindow = () => {
        setState((state) => ({ ...state, dialogWindowActive: false }));
    };

    const setAlertActive = (val, message) => {
        clearTimeout(timeoutState);
        setState((state) => ({
            ...state,
            alertActive: val,
            alertMessage: message,
        }));

        if (val === true) {
            setTimeoutState(
                setTimeout(() => {
                    setState((state) => ({
                        ...state,
                        alertActive: false,
                        alertMessage: "",
                    }));
                }, 3000)
            );
        }
    };

    let dialogWindow = (
        <DialogWindow
            className="dialog-invisible"
            component={state.dialogWindowComponent}
        />
    );
    if (state.dialogWindowActive) {
        dialogWindow = (
            <DialogWindow
                className="dialog-visible"
                component={state.dialogWindowComponent}
            />
        );
    }

    let alert = <Alert className="dialog-invisible" />;
    if (state.alertActive) {
        alert = <Alert message={state.alertMessage} />;
    }

    let friendList = null;
    if (globalUserState.user) {
        friendList = <FriendList className="friends-invisible" />;
        if (state.friendsOpened) {
            friendList = <FriendList />;
        }
    }

    let arrowClass = "open_friends_arrow visible";
    if (state.friendsOpened) {
        arrowClass = "open_friends_arrow invisible";
    }

    return (
        <BrowserRouter>
            <ThemeContext.Provider
                value={{
                    colors: themeState === "light" ? themes.light : themes.dark,
                    selectedTheme: themeState,
                    setTheme: setThemeState,
                    pngInvert,
                }}
            >
                <PopupContext.Provider
                    value={{
                        alertActive: state.alertActive,
                        setAlertActive,
                        openDialogWindow,
                        closeDialogWindow,
                        profileUserId: state.profileUserId,
                        setFriendsOpened,
                        friendsOpened: state.friendsOpened,
                        group: state.group,
                    }}
                >
                    <UserContext.Provider
                        value={{ globalUserState, updateGlobalUserState }}
                    >
                        <ConvContext.Provider
                            value={{ convState, updateConvState }}
                        >
                            <SocketContext.Provider
                                value={{ socketState, setSocketState }}
                            >
                                {loadingState.loading ? (
                                    <Loader className="loader" />
                                ) : (
                                    <div id="App">
                                        {alert}
                                        <Topbar />
                                        {globalUserState.user ? (
                                            <img
                                                src={require("./assets/black_left_arrow.png")}
                                                alt="close"
                                                className={arrowClass}
                                                style={{
                                                    backgroundColor:
                                                        themeState === "light"
                                                            ? themes.light
                                                                  .primaryLight
                                                            : themes.dark
                                                                  .primaryLight,
                                                    filter: pngInvert(),
                                                }}
                                                onClick={() =>
                                                    setFriendsOpened(true)
                                                }
                                            />
                                        ) : null}
                                        {friendList}
                                        <Conversations />
                                        {dialogWindow}
                                        <Switch>
                                            <Route
                                                path="/"
                                                exact
                                                component={Home}
                                            />
                                            <PrivateRoute
                                                path="/games/:gameId"
                                                exact
                                                component={Game}
                                            />
                                        </Switch>
                                    </div>
                                )}
                            </SocketContext.Provider>
                        </ConvContext.Provider>
                    </UserContext.Provider>
                </PopupContext.Provider>
            </ThemeContext.Provider>
        </BrowserRouter>
    );
};

export default Radium(App);
