import React from "react";
import "./Person.scss";
import request from "../../utils/request";
// import UserContext from "../../../utils/UserContext";

const Person = (props) => {
    // const userContext = useContext(UserContext); TODO
    const addFriend = async () => {
        await request(
            "patch",
            `http://localhost:8000/users/${props.user._id}/addFriend`,
            null,
            true
        );
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
