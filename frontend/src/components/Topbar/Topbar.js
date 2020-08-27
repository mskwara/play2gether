import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.scss";

const Topbar = (props) => {
    return (
        <div id="Topbar" className="normal">
            <Link className="title" to="/">
                Play2gether
            </Link>
            <div className="links">
                <div className="link">
                    <Link to="/">Home</Link>
                    <div className="underline" />
                </div>
                <div className="link">
                    <Link>Friends</Link>
                    <div className="underline" />
                </div>
                <div className="link">
                    <Link>Favourites</Link>
                    <div className="underline" />
                </div>
                <div className="link">
                    <Link onClick={props.openSignup}>Sign up</Link>
                    <div className="underline" />
                </div>
                <div className="link">
                    <Link onClick={props.openLogin}>Login</Link>
                    <div className="underline" />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
