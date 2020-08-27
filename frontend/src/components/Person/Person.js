import React from "react";
import "./Person.scss";

const Person = (props) => {
    return (
        <div id="Person" className={props.className}>
            <div className="slider">
                <div className="user">
                    <p>Vexorth</p>
                </div>
                <img src={require("../../assets/default.png")} alt="photo" />
                <div className="buttons">
                    <img
                        src={require("../../assets/invite_to_game.png")}
                        alt="photo"
                        className="btn"
                    />
                    <img
                        src={require("../../assets/message.png")}
                        alt="photo"
                        className="btn"
                    />
                    <img
                        src={require("../../assets/add_friend.png")}
                        alt="photo"
                        className="btn"
                    />
                </div>
            </div>
        </div>
    );
};

export default Person;
