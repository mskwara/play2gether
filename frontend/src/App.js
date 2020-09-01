import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import Game from "./views/Game/Game";
import Topbar from "./components/Topbar/Topbar";
import Loader from "./components/Loader/Loader";
import FriendList from "./components/FriendList/FriendList";
import Conversations from "./components/Conversations/Conversations";
import Alert from "./components/Alert/Alert";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import PopupContext from "./utils/PopupContext";
import UserContext from "./utils/UserContext";
import ConvContext from "./utils/ConvContext";
import SocketContext from "./utils/SocketContext";
import PrivateRoute from "./utils/PrivateRoute";
import "./App.scss";
import request from "./utils/request";
import io from "socket.io-client";

const App = (props) => {
    const [state, setState] = useState({
        signupOpened: false,
        loginOpened: false,
        friendsOpened: false,
        alertActive: false,
        alertMessage: "",
    });

    const [loadingState, setLoadingState] = useState({ loading: true });

    const [globalUserState, setGlobalUserState] = useState({
        user: null,
        conversations: [],
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
                const convRes = await request(
                    "get",
                    "http://localhost:8000/conversations?group=false",
                    null,
                    true
                );
                updateGlobalUserState({
                    user: res.data.user,
                    conversations: convRes.data.data.data,
                    jwt: res.data.token,
                });
            } else {
                updateGlobalUserState({ user: null, conversations: [] });
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

    const openSignup = () => {
        setState((state) => ({
            ...state,
            signupOpened: true,
            loginOpened: false,
        }));
    };

    const openLogin = () => {
        setState((state) => ({
            ...state,
            loginOpened: true,
            signupOpened: false,
        }));
    };

    const setFriendsOpened = (val) => {
        setState((state) => ({
            ...state,
            friendsOpened: val,
        }));
    };

    const closeSignup = () => {
        setState((state) => ({ ...state, signupOpened: false }));
    };

    const closeLogin = () => {
        setState((state) => ({ ...state, loginOpened: false }));
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

    let signup = <Signup className="dialog-invisible" />;
    if (state.signupOpened) {
        signup = (
            <Signup className="dialog-visible" closeSignup={closeSignup} />
        );
    }

    let login = <Login className="dialog-invisible" />;
    if (state.loginOpened) {
        login = <Login className="dialog-visible" closeLogin={closeLogin} />;
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
            <PopupContext.Provider
                value={{
                    alertActive: state.alertActive,
                    setAlertActive,
                    openSignup,
                    openLogin,
                    setFriendsOpened,
                    friendsOpened: state.friendsOpened,
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
                                    <img
                                        src={require("./assets/black_left_arrow.png")}
                                        alt="close"
                                        className={arrowClass}
                                        onClick={() => setFriendsOpened(true)}
                                    />
                                    {friendList}
                                    <Conversations />
                                    {signup}
                                    {login}
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
        </BrowserRouter>
    );
};

export default App;
