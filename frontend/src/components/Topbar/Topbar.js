import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.scss";

const Topbar = (props) => {
    return (
        <div id="Topbar">
            <Link className="title" to="/">
                Play2gether
            </Link>
            <div className="links">
                <div className="link">
                    <a href="/">Home</a>
                    <div className="underline" />
                </div>
                <div className="link">
                    <a href="/">Friends</a>
                    <div className="underline" />
                </div>
                <div className="link">
                    <a href="/">Favourites</a>
                    <div className="underline" />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
