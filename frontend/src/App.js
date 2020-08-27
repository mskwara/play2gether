import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import Game from "./views/Game/Game";
import Topbar from "./components/Topbar/Topbar";
import Signup from "./components/Signup/Signup";
import "./App.scss";
// import axios from "axios";

const App = (props) => {
    const [state, setState] = useState({
        signupOpened: false,
    });
    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:8000/");
    //             setState((state) => ({
    //                 ...state,
    //                 message: res.data.message,
    //             }));
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getData();
    // }, []);

    const openSignup = () => {
        setState((state) => ({ ...state, signupOpened: true }));
    };

    const closeSignup = () => {
        setState((state) => ({ ...state, signupOpened: false }));
    };

    let signup = <Signup className="signup-invisible" />;
    if (state.signupOpened) {
        signup = (
            <Signup className="signup-visible" closeSignup={closeSignup} />
        );
    }

    return (
        <BrowserRouter>
            <div id="App">
                <Topbar openSignup={openSignup} />
                {signup}
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/games/:gameId" exact component={Game} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
