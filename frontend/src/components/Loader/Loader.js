import React, { useContext } from "react";
import "./Loader.scss";
import ThemeContext from "../../utils/ThemeContext";

const Loader = (props) => {
    const theme = useContext(ThemeContext);
    return (
        <div id="Loader" className={props.className}>
            <div
                className="spinner type-1"
                style={{ borderTopColor: theme.colors.primary }}
            />
            <div
                className="spinner type-2"
                style={{ borderTopColor: theme.colors.primaryHover }}
            />
        </div>
    );
};

export default Loader;
