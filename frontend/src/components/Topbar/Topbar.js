import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Radium from "radium";
import "./Topbar.scss";
import request from "../../utils/request";
import PopupContext from "../../utils/PopupContext";
import UserContext from "../../utils/UserContext";
import ThemeContext from "../../utils/ThemeContext";

const Topbar = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);
    const theme = useContext(ThemeContext);

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
                privateConversations: [],
                groupConversations: [],
            });
            setState({ reload: !state.reload });
            popupContext.setAlertActive(true, "You have been logged out!");
        }
    };

    const switchFriendsGroups = (group) => {
        if (popupContext.friendsOpened) {
            if (!group && !popupContext.group) {
                //clicked friends, now opened friends
                popupContext.setFriendsOpened(false, false);
            } else if (!group && popupContext.group) {
                //clicked friends, now opened groups
                popupContext.setFriendsOpened(true, false);
            } else if (group && !popupContext.group) {
                //clicked groups, now opened friends
                popupContext.setFriendsOpened(true, true);
            } else if (group && popupContext.group) {
                //clicked groups, now opened groups
                popupContext.setFriendsOpened(false, true);
            }
        } else {
            popupContext.setFriendsOpened(true, group);
        }
    };

    // const settingOpenDialog = (component) => {
    //     popupContext.openDialogWindow(component)
    // }

    let settingsClass = "settings";
    if (state.settingsOpened) {
        settingsClass += " settings-visible";
    }

    const hoveringButtonsStyle = {
        ":hover": {
            backgroundColor: theme.colors.commentHover,
        },
    };

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
                <p onClick={() => switchFriendsGroups(false)}>Friends</p>
                <div className="underline" />
            </div>,
            <div className="link" key="3">
                <p onClick={() => switchFriendsGroups(true)}>Groups</p>
                <div className="underline" />
            </div>,
            <div className="link" key="4">
                <p onClick={logout}>Logout</p>
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
                    style={hoveringButtonsStyle}
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
                <div
                    className="divider"
                    style={{ borderBottom: `1px solid ${theme.colors.border}` }}
                />
                <button
                    className="settings-button"
                    style={hoveringButtonsStyle}
                    onClick={() => {
                        popupContext.openDialogWindow("editMyProfile");
                        setState((state) => ({
                            ...state,
                            settingsOpened: false,
                        }));
                    }}
                    key="editprofile"
                >
                    Edit my profile
                </button>
                <button
                    className="settings-button"
                    style={hoveringButtonsStyle}
                    key="darkmode"
                    onClick={() =>
                        theme.selectedTheme === "light"
                            ? theme.setTheme("dark")
                            : theme.setTheme("light")
                    }
                >
                    Dark mode
                </button>
                <button
                    className="settings-button"
                    style={hoveringButtonsStyle}
                    onClick={logout}
                    key="logout"
                >
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
                <p onClick={() => popupContext.openDialogWindow("login")}>
                    Login
                </p>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <p onClick={() => popupContext.openDialogWindow("signup")}>
                    Sign up
                </p>
                <div className="underline" />
            </div>,
        ];
    }

    return (
        <div
            id="Topbar"
            className="normal"
            style={{ backgroundColor: theme.colors.primary }}
        >
            <Link className="title" to="/">
                Play2gether
            </Link>
            <div className="links">{links}</div>
            {logged_user}
            {settings}
        </div>
    );
};

export default Radium(Topbar);
