import React, { useContext } from "react";
import "./Person.scss";
import request from "../../utils/request";
import UserContext from "../../utils/UserContext";

const Person = (props) => {
    const userContext = useContext(UserContext);
    const addFriend = async () => {
        await request(
            "patch",
            `http://localhost:8000/users/${props.user._id}/addFriend`,
            null,
            true
        );
    };
    let addFriendButton = null;

    if (
        !userContext.globalUserState.user.friends.some(
            (f) => f._id === props.user._id
        ) &&
        !userContext.globalUserState.user.pendingFriendRequests.some(
            (f) => f._id === props.user._id
        ) &&
        !userContext.globalUserState.user.receivedFriendRequests.some(
            (f) => f._id === props.user._id
        )
    ) {
        //they are not friends and didn't invite each other
        addFriendButton = (
            <img
                src={require("../../assets/add_friend.png")}
                alt="button"
                className="btn"
                onClick={addFriend}
            />
        );
    }

    let buttons = null;
    let sliderClass = "slider";
    if (props.user._id !== userContext.globalUserState.user._id) {
        // jeśli nie najeżdżam na siebie samego
        buttons = (
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
                {addFriendButton}
            </div>
        );
        sliderClass += " slide-down";
    }

    return (
        <div id="Person" className={props.className}>
            <div className={sliderClass}>
                <div className="user">
                    <p>{props.user.name}</p>
                </div>
                <img
                    src={require(`../../../../backend/static/users/${props.user.photo}`)}
                    alt="avatar"
                />
                {buttons}
            </div>
        </div>
    );
};

export default Person;
