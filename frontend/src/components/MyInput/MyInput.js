import React from "react";
import "./MyInput.scss";

const MyInput = (props) => {
    const labelId = `${props.labelId}_label_${props.name}`;
    const handleInputChange = (event) => {
        if (event.target.value !== "") {
            document.getElementById(labelId).classList.add("filled");
        } else {
            document.getElementById(labelId).classList.remove("filled");
        }
        props.handleInputChange(event);
    };

    if (document.getElementById(labelId) && props.value === "") {
        document.getElementById(labelId).classList.remove("filled");
    }

    return (
        <div id="MyInput">
            <label id={labelId}>{props.placeholder}</label>
            <input
                id="input"
                type={props.type}
                name={props.name}
                value={props.value}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default MyInput;
