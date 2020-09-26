import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Radium from "radium";
import "./Topbar.scss";
import request from "../../utils/request";
import { getPhotoFromAWS } from "../../utils/methods";
import PopupContext from "../../utils/PopupContext";
import UserContext from "../../utils/UserContext";
import ConvContext from "../../utils/ConvContext";
import ThemeContext from "../../utils/ThemeContext";

const Topbar = (props) => {
    const popupContext = useContext(PopupContext);
    const convContext = useContext(ConvContext);
    const userContext = useContext(UserContext);
    const theme = useContext(ThemeContext);
    const history = useHistory();

    const [state, setState] = useState({
        settingsOpened: false,
        photo: require(`../../assets/defaultUser.jpeg`),
    });

    useEffect(() => {
        if (
            userContext.globalUserState.user &&
            userContext.globalUserState.user.photo !== "defaultUser.jpeg"
        ) {
            getPhotoFromAWS(userContext.globalUserState.user.photo, (photo) => {
                setState((state) => ({ ...state, photo }));
            });
        } else {
            setState((state) => ({
                ...state,
                photo: require(`../../assets/defaultUser.jpeg`),
            }));
        }
    }, [userContext.globalUserState.user]);

    const logout = async () => {
        const res = await request(
            "post",
            `${process.env.REACT_APP_HOST}api/users/logout`,
            null,
            true
        );

        if (res.data.status === "success") {
            userContext.updateGlobalUserState({
                user: null,
                privateConversations: [],
                groupConversations: [],
                jwt: "logout",
            });
            convContext.updateConvState({ openedConvs: [] });
            clearInterval(userContext.intervals.meAndConvsInterval);
            popupContext.setFriendsOpened(false);
            setState((state) => ({ ...state, settingsOpened: false }));
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

    const goToPage = (link) => {
        history.push({
            pathname: link,
        });
    };

    let settingsClass = "settings";
    if (state.settingsOpened) {
        settingsClass += " settings-visible";
    }

    const hoveringButtonsStyle = {
        color: theme.colors.primaryText,
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
                <p onClick={() => goToPage("/")}>Home</p>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                {userContext.globalUserState.user.updatedPrivateConversations
                    .length > 0 ? (
                    <div className="notification-dot" />
                ) : null}
                <p onClick={() => switchFriendsGroups(false)}>Friends</p>
                <div className="underline" />
            </div>,
            <div className="link" key="3">
                {userContext.globalUserState.user.updatedGroupConversations
                    .length > 0 ? (
                    <div className="notification-dot" />
                ) : null}
                <p onClick={() => switchFriendsGroups(true)}>Groups</p>
                <div className="underline" />
            </div>,
            // <div className="link" key="4">
            //     <p onClick={logout}>Logout</p>
            //     <div className="underline" />
            // </div>,
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
                <img src={state.photo} alt="avatar" />
                <p>{userContext.globalUserState.user.name}</p>
            </div>
        );

        settings = (
            <div
                className={settingsClass}
                style={{
                    backgroundColor: theme.colors.settings,
                    color: theme.colors.primaryText,
                    border: `1px solid ${theme.colors.border}`,
                }}
            >
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
                    <img src={state.photo} alt="avatar" />
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
                    {theme.selectedTheme === "light"
                        ? "Dark mode"
                        : "Light mode"}
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
                <p onClick={() => goToPage("/")}>Home</p>
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
            style={{
                backgroundColor: theme.colors.topbar,
                borderBottom: `1px solid ${theme.colors.topbarBorder}`,
                // color: theme.colors.primaryText,
            }}
        >
            <p className="title" onClick={() => goToPage("/")}>
                Play2gether
            </p>
            <div className="links">{links}</div>
            {logged_user}
            {settings}
        </div>
    );
};

export default Radium(Topbar);
