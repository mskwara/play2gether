import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

const App = (props) => {
    const [state, setState] = useState({
        message: "",
    });
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:8000/");
                setState((state) => ({
                    ...state,
                    message: res.data.message,
                }));
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Tajna wiadomość: {state.message}</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default App;
