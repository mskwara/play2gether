import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import Game from "./views/Game/Game";
import Topbar from "./components/Topbar/Topbar";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import "./App.scss";
// import axios from "axios";

const App = (props) => {
    const [state, setState] = useState({
        signupOpened: false,
        loginOpened: false,
    });
    // useEffect(() => {
    //     const checkLogin = async () => {
    //         try {
    //             const res = await axios.get(
    //                 "http://localhost:8000/users/isloggedin",
    //                 {
    //                     withCredentials: true,
    //                 }
    //             );
    //             console.log(res.data);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     checkLogin();
    // }, []);

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

    const closeSignup = () => {
        setState((state) => ({ ...state, signupOpened: false }));
    };

    const closeLogin = () => {
        setState((state) => ({ ...state, loginOpened: false }));
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

    return (
        <BrowserRouter>
            <div id="App">
                <Topbar openSignup={openSignup} openLogin={openLogin} />
                {signup}
                {login}
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/games/:gameId" exact component={Game} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
