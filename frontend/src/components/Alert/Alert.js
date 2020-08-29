import React from "react";
import "./Alert.scss";

const Alert = (props) => {
    return (
        <div id="Alert" className={props.className}>
            <p>{props.message}</p>
        </div>
    );
};

export default Alert;
