import React from "react";
import "./Loader.scss";

const Loader = (props) => {
    return (
        <div id="Loader" className={props.className}>
            <div className="spinner type-1" />
            <div className="spinner type-2" />
        </div>
    );
};

export default Loader;
