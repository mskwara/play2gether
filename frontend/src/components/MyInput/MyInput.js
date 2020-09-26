import React, { useContext } from "react";
import "./MyInput.scss";
import Radium from "radium";
import ThemeContext from "../../utils/ThemeContext";

const MyInput = (props) => {
    const theme = useContext(ThemeContext);

    const labelId = `${props.labelId}_label_${props.name}`;

    const handleInputChange = (event) => {
        if (event.target.value !== "") {
            document.getElementById(labelId).classList.add("filled");
        } else {
            document.getElementById(labelId).classList.remove("filled");
        }
        props.handleInputChange(event);
    };

    let labelClass = "filled";
    if (props.value === "") {
        labelClass = "";
    }

    return (
        <div id="MyInput" className={props.className}>
            <label
                id={labelId}
                className={labelClass}
                style={{ color: theme.colors.label }}
            >
                {props.placeholder}
            </label>
            <input
                id="input"
                type={props.type}
                name={props.name}
                value={props.value}
                onChange={handleInputChange}
                style={{
                    // borderBottom: `1px solid ${theme.colors.border}`,
                    color: theme.colors.label,
                    // ":focus": {
                    //     borderBottom: `1px solid green`,
                    // },
                }}
            />
        </div>
    );
};

export default Radium(MyInput);
