import React from "react";
import "./MyInput.scss";

const MyInput = (props) => {
    const labelId = `signup_label_${props.name}`;
    const handleInputChange = (event) => {
        if (event.target.value !== "") {
            document.getElementById(labelId).classList.add("filled");
        } else {
            document.getElementById(labelId).classList.remove("filled");
        }
        props.handleInputChange(event);
    };
    return (
        <div id="MyInput">
            <label id={labelId}>{props.placeholder}</label>
            <input
                type={props.type}
                name={props.name}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default MyInput;
