import React from "react";
import "./Loader.scss";

const Loader = (props) => {
    return (
        <div id="Loader">
            <div className="spinner type-1" />
            <div className="spinner type-2" />
        </div>
    );
};

export default Loader;
