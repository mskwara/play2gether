import React, { useState, useContext, useEffect } from "react";
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
        settingsOpened: false,
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

    // const settingOpenDialog = (component) => {
    //     popupContext.openDialogWindow(component)
    // }

    let settingsClass = "settings";
    if (state.settingsOpened) {
        settingsClass += " settings-visible";
    }

    let links = null;
    let logged_user = null;
    let settings = null;
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
                <Link>Favourites</Link>
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
                    setState((state) => ({
                        ...state,
                        settingsOpened: !state.settingsOpened,
                    }))
                }
            >
                <img
                    src={require(`../../../../backend/static/users/${userContext.globalUserState.user.photo}`)}
                    alt="avatar"
                />
                <p>{userContext.globalUserState.user.name}</p>
            </div>
        );

        settings = (
            <div className={settingsClass}>
                <div
                    className="logged_user"
                    onClick={() => {
                        popupContext.openDialogWindow("profile", {
                            profileUserId: userContext.globalUserState.user._id,
                        });
                        setState((state) => ({
                            ...state,
                            settingsOpened: false,
                        }));
                    }}
                >
                    <img
                        src={require(`../../../../backend/static/users/${userContext.globalUserState.user.photo}`)}
                        alt="avatar"
                    />
                    <span>
                        <p>{userContext.globalUserState.user.name}</p>
                        <p className="hint">View your profile</p>
                    </span>
                </div>
                <div className="divider" />
                <button
                    className="settings-button"
                    onClick={() => {
                        popupContext.openDialogWindow("editMyProfile");
                        setState((state) => ({
                            ...state,
                            settingsOpened: false,
                        }));
                    }}
                >
                    Edit my profile
                </button>
                <button className="settings-button">Dark mode</button>
                <button className="settings-button" onClick={logout}>
                    Logout
                </button>
            </div>
        );
    } else {
        links = [
            <div className="link" key="1">
                <Link to="/">Home</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="3">
                <a onClick={() => popupContext.openDialogWindow("login")}>
                    Login
                </a>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <a onClick={() => popupContext.openDialogWindow("signup")}>
                    Sign up
                </a>
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
            {settings}
        </div>
    );
};

export default Topbar;
