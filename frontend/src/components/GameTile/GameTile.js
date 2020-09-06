import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import "./GameTile.scss";
import UserContext from "../../utils/UserContext";
import PopupContext from "../../utils/PopupContext";

const GameTile = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const history = useHistory();

    let bgImage = require("../../assets/valorant.jpg");
    const tileStyle = {
        backgroundImage: `url(${bgImage})`,
    };
    if (props.size === "small") {
        tileStyle.width = "200px";
        tileStyle.minWidth = "200px";
        tileStyle.height = "240px";
        tileStyle.minHeight = "240px";
    }

    const tileClickHandler = () => {
        if (userContext.globalUserState.user) {
            // there is a logged user
            history.push({
                pathname: `/games/${props.game._id}`,
            });
            popupContext.closeDialogWindow();
        } else {
            popupContext.setAlertActive(
                true,
                `You have to be logged to get in!`
            );
        }
    };

    return (
        <div
            id="GameTile"
            style={tileStyle}
            onClick={tileClickHandler}
            className={props.className}
        >
            <h1>{props.game.title}</h1>
            <div className="description">
                <p>{props.game.description}</p>
            </div>
        </div>
    );
};

export default GameTile;
