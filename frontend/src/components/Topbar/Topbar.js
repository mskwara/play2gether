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
            userContext.updateGlobalUserState({ user: null });
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
                <Link
                    onClick={() =>
                        popupContext.setFriendsOpened(
                            !popupContext.friendsOpened
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
                <Link onClick={popupContext.openLogin}>Login</Link>
                <div className="underline" />
            </div>,
            <div className="link" key="2">
                <Link onClick={popupContext.openSignup}>Sign up</Link>
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
