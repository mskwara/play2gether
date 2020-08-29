import React from "react";
import "./Person.scss";
import axios from "axios";

const Person = (props) => {
    const addFriend = async () => {
        const res = await axios.post(
            `http://localhost:8000/users/${props.user._id}/addFriend`,
            null,
            {
                withCredentials: true,
            }
        );
        console.log(res);
    };

    return (
        <div id="Person" className={props.className}>
            <div className="slider">
                <div className="user">
                    <p>{props.user.name}</p>
                </div>
                <img
                    src={require(`../../../../backend/static/users/${props.user.photo}`)}
                    alt="avatar"
                />
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
                        onClick={addFriend}
                    />
                </div>
            </div>
        </div>
    );
};

export default Person;
