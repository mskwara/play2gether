import React from "react";
import "./Topbar.scss";

const Topbar = (props) => {
    return (
        <div id="Topbar">
            <h1 className="title">Play2gether</h1>
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
