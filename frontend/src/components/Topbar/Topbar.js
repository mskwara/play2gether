import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Topbar.scss";
import axios from "axios";
import AlertContext from "../../utils/AlertContext";

const Topbar = (props) => {
    const alertContext = useContext(AlertContext);

    const [state, setState] = useState({
        reload: false,
    });

    const logout = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/users/logout",
                null,
                {
                    withCredentials: true,
                }
            );
            if (res.data.status === "success") {
                localStorage.setItem("userId", undefined);
                localStorage.setItem("userName", undefined);
                localStorage.setItem("userPhoto", undefined);
                setState({ reload: !state.reload });
                alertContext.setAlertActive(true, "You have been logged out!");
            }
        } catch (err) {
            console.log(err);
        }
    };

    let links = null;
    if (
        localStorage.getItem("userId") !== null &&
        localStorage.getItem("userId") !== "undefined"
    ) {
        // user is loggedIn
        links = [
            <div className="link" key="1">
                <Link to="/">Home</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <Link onClick={alertContext.switchOpenFriends}>Friends</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="3">
                <Link>Favourites</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="4">
                <Link onClick={logout}>Logout</Link>
                <div className="underline" />
            </div>,
        ];
    } else {
        links = [
            <div className="link" key="1">
                <Link to="/">Home</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="3">
                <Link onClick={alertContext.openLogin}>Login</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <Link onClick={alertContext.openSignup}>Sign up</Link>
                <div className="underline" />
            </div>,
        ];
    }

    return (
        <div id="Topbar" className="normal">
            <Link className="title" to="/">
                Play2gether
            </Link>
            <div className="links">{links}</div>
        </div>
    );
};

export default Topbar;
