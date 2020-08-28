import React from "react";
import "./Person.scss";

const Person = (props) => {
    return (
        <div id="Person" className={props.className}>
            <div className="slider">
                <div className="user">
                    <p>Vexorth</p>
                </div>
                <img src={require("../../assets/default.png")} alt="avatar" />
                <div className="buttons">
                    <img
                        src={require("../../assets/invite_to_game.png")}
                        alt="button"
                        className="btn"
                    />
                    <img
                        src={require("../../assets/message.png")}
                        alt="button"
                        className="btn"
                    />
                    <img
                        src={require("../../assets/add_friend.png")}
                        alt="button"
                        className="btn"
                    />
                </div>
            </div>
        </div>
    );
};

export default Person;
