import React, { useContext } from "react";
import "./MyButton.scss";
import Radium from "radium";
import ThemeContext from "../../utils/ThemeContext";

const MyButton = (props) => {
    const theme = useContext(ThemeContext);

    return (
        <button
            id="MyButton"
            className={props.className}
            style={{
                backgroundColor: theme.colors.primary,
                ":hover": {
                    backgroundColor: theme.colors.primaryHover,
                },
            }}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export default Radium(MyButton);
