import React, { useContext } from "react";
import "./GameTile.scss";
import UserContext from "../../utils/UserContext";
import AlertContext from "../../utils/AlertContext";

const GameTile = (props) => {
    const userContext = useContext(UserContext);
    const alertContext = useContext(AlertContext);

    let bgImage = require("../../assets/valorant.jpg");
    const tileStyle = {
        backgroundImage: `url(${bgImage})`,
    };

    const tileClickHandler = () => {
        if (userContext.globalUserState.user) {
            // there is a logged user
            props.history.push({
                pathname: `/games/${props.game._id}`,
            });
        } else {
            alertContext.setAlertActive(
                true,
                `You have to be logged in to get in!`
            );
        }
    };

    return (
        <div id="GameTile" style={tileStyle} onClick={tileClickHandler}>
            <h1>{props.game.title}</h1>
            <div className="description">
                <p>{props.game.description}</p>
            </div>
        </div>
    );
};

export default GameTile;
