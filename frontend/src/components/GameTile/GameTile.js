import React from "react";
import "./GameTile.scss";
// import axios from "axios";

const GameTile = (props) => {
    let bgImage = require("../../assets/valorant.jpg");
    const tileStyle = {
        backgroundImage: `url(${bgImage})`,
    };

    const tileClickHandler = () => {
        props.history.push({
            pathname: `/games/${props.game._id}`,
        });
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