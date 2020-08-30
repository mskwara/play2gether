import React, { useState, useEffect, useContext } from "react";
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
import AlertContext from "./utils/AlertContext";
import UserContext from "./utils/UserContext";
import "./App.scss";
import request from "./utils/request";

const App = (props) => {
    const [state, setState] = useState({
        signupOpened: false,
        loginOpened: false,
        friendsOpened: false,
        alertActive: false,
        alertMessage: "",
    });

    const [loadingState, setLoadingState] = useState({ loading: true });

    const [globalUserState, setGlobalUserState] = useState({ user: null });

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
                setGlobalUserState({ user: res.data.user });
            } else {
                setGlobalUserState({ user: null });
            }
            setLoadingState({ loading: false });
        };
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

    return (
        <BrowserRouter>
            <AlertContext.Provider
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
                    value={{ globalUserState, setGlobalUserState }}
                >
                    {loadingState.loading ? (
                        <Loader className="loader" />
                    ) : (
                        <div id="App">
                            {alert}
                            <Topbar />
                            {friendList}
                            <Conversations />
                            {signup}
                            {login}
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route
                                    path="/games/:gameId"
                                    exact
                                    component={Game}
                                />
                            </Switch>
                        </div>
                    )}
                </UserContext.Provider>
            </AlertContext.Provider>
        </BrowserRouter>
    );
};

export default App;
