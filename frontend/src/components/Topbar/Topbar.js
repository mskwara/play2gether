import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.scss";

const Topbar = (props) => {
    let links = null;
    console.log(localStorage.getItem("userId"));
    // if (
    //     localStorage.getItem("userId") !== null &&
    //     localStorage.getItem("userId") !== undefined
    // ) {
    //     links = [
    //         <div className="link" key="1">
    //             <Link to="/">Home</Link>
    //             <div className="underline" />
    //         </div>,
    //         <div className="link" key="2">
    //             <Link>Friends</Link>
    //             <div className="underline" />
    //         </div>,
    //         <div className="link" key="3">
    //             <Link>Favourites</Link>
    //             <div className="underline" />
    //         </div>,
    //         <div className="link" key="4">
    //             <Link>Logout</Link>
    //             <div className="underline" />
    //         </div>,
    //     ];
    // } else {
    links = [
        <div className="link" key="1">
            <Link to="/">Home</Link>
            <div className="underline" />
        </div>,
        <div className="link" key="2">
            <Link onClick={props.openSignup}>Sign up</Link>
            <div className="underline" />
        </div>,
        <div className="link" key="3">
            <Link onClick={props.openLogin}>Login</Link>
            <div className="underline" />
        </div>,
    ];
    // }

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
