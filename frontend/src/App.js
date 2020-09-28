import React, { useState, useEffect, useRef } from "react";
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
    console.log(process.env.PORT);
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

    const convStateRef = useRef(convState);

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
        convStateRef.current = {
            ...convStateRef.current,
            ...updatedFields,
        };
        setConvState((convState) => ({
            ...convState,
            ...updatedFields,
        }));
    };

    const [timeoutState, setTimeoutState] = useState();
    const [intervals, setIntervals] = useState({});

    const setGlobalIntervals = () => {
        const meAndConvsInterval = setInterval(async () => {
            const res = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/users/me`,
                null,
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

                const newUser = { ...res.data.data };
                newUser.updatedPrivateConversations = newUser.updatedPrivateConversations.filter(
                    (updPriv) =>
                        !convStateRef.current.openedConvs.some(
                            (opConv) => opConv._id === updPriv
                        )
                );

                newUser.updatedGroupConversations = newUser.updatedGroupConversations.filter(
                    (updGroup) =>
                        !convStateRef.current.openedConvs.some(
                            (opConv) => opConv._id === updGroup
                        )
                );
                updateGlobalUserState({
                    user: newUser,
                    privateConversations: privateConvRes.data.data,
                    groupConversations: groupConvRes.data.data,
                });
            } else {
                updateGlobalUserState({
                    user: null,
                    privateConversations: [],
                    groupConversations: [],
                });
            }
        }, 10000);

        setIntervals({ ...intervals, meAndConvsInterval: meAndConvsInterval });
    };
    useEffect(() => {
        const checkLogin = async () => {
            const res = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/users/me`,
                null,
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
                updateGlobalUserState({
                    user: res.data.data,
                    privateConversations: privateConvRes.data.data,
                    groupConversations: groupConvRes.data.data,
                    jwt: res.data.token,
                });
                setGlobalIntervals();
            } else {
                updateGlobalUserState({
                    user: null,
                    privateConversations: [],
                    groupConversations: [],
                });
            }
            setLoadingState({ loading: false });
        };

        const socket = io.connect(`${process.env.REACT_APP_HOST}`);
        setSocketState((socketState) => ({ ...socketState, socket }));
        checkLogin();

        // return () => {
        //     clearInterval(intervals.meAndConvsInterval);
        // };
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
            active={state.dialogWindowActive}
        />
    );
    if (state.dialogWindowActive) {
        dialogWindow = (
            <DialogWindow
                className="dialog-visible"
                component={state.dialogWindowComponent}
                active={state.dialogWindowActive}
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
                        value={{
                            globalUserState,
                            updateGlobalUserState,
                            intervals,
                            setIntervals,
                            setGlobalIntervals,
                        }}
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
                                    <div
                                        id="App"
                                        className={
                                            themeState === "dark"
                                                ? "darkbg"
                                                : "lightbg"
                                        }
                                    >
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
                                                    setFriendsOpened(
                                                        true,
                                                        state.group
                                                    )
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
