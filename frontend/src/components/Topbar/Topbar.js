import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Topbar.scss";
import request from "../../utils/request";
import PopupContext from "../../utils/PopupContext";
import UserContext from "../../utils/UserContext";

const Topbar = (props) => {
    const popupContext = useContext(PopupContext);
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
            userContext.updateGlobalUserState({
                user: null,
                conversations: [],
            });
            setState({ reload: !state.reload });
            popupContext.setAlertActive(true, "You have been logged out!");
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
                <a
                    onClick={() =>
                        popupContext.setFriendsOpened(
                            !popupContext.friendsOpened
                        )
                    }
                >
                    Friends
                </a>
                <div className="underline" />
            </div>,
            <div className="link" key="3">
                <a>Favourites</a>
                <div className="underline" />
            </div>,
            <div className="link" key="4">
                <a onClick={logout}>Logout</a>
                <div className="underline" />
            </div>,
        ];

        logged_user = (
            <div
                className="logged_user"
                onClick={() =>
                    popupContext.setProfileOpened(
                        true,
                        userContext.globalUserState.user._id
                    )
                }
            >
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
                <a onClick={popupContext.openLogin}>Login</a>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <a onClick={popupContext.openSignup}>Sign up</a>
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
