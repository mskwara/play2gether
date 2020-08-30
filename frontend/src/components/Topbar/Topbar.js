import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Topbar.scss";
import request from "../../utils/request";
import AlertContext from "../../utils/AlertContext";
import UserContext from "../../utils/UserContext";

const Topbar = (props) => {
    const alertContext = useContext(AlertContext);
    const userContext = useContext(UserContext);

    const [state, setState] = useState({
        reload: false,
    });

    const logout = async () => {
        const res = await request(
            "post",
            "http://localhost:8000/users/logout",
            null,
            true
        );

        if (res.data.status === "success") {
            userContext.setGlobalUserState({ user: null });
            // localStorage.setItem("userId", undefined);
            // localStorage.setItem("userName", undefined);
            // localStorage.setItem("userPhoto", undefined);
            setState({ reload: !state.reload });
            alertContext.setAlertActive(true, "You have been logged out!");
        }
    };

    let links = null;
    let logged_user = null;
    if (userContext.globalUserState.user) {
        // user is loggedIn
        links = [
            <div className="link" key="1">
                <Link to="/">Home</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <Link
                    onClick={() =>
                        alertContext.setFriendsOpened(
                            !alertContext.friendsOpened
                        )
                    }
                >
                    Friends
                </Link>
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

        logged_user = (
            <div className="logged_user">
                <img
                    src={require(`../../../../backend/static/users/${userContext.globalUserState.user.photo}`)}
                    alt="avatar"
                />
                <p>{userContext.globalUserState.user.name}</p>
            </div>
        );
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
            {logged_user}
        </div>
    );
};

export default Topbar;
