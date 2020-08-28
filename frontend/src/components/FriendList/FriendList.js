import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./FriendList.scss";
// import axios from "axios";
import UserContext from "../../utils/UserContext";

const FriendList = (props) => {
    const userContext = useContext(UserContext);
    const activeUser = userContext.globalUserState.user;
    let friends = null;
    if (activeUser) {
        activeUser.friends.push(
            {
                name: "Rafau",
                photo: "defaultUser.jpeg",
            },
            {
                name: "Anna Balon",
                photo: "defaultUser.jpeg",
            }
        );
        friends = activeUser.friends.map((f) => {
            return (
                <div class="person">
                    <img
                        src={require(`../../../../backend/static/users/${f.photo}`)}
                        alt="avatar"
                    />
                    <p>{f.name}</p>
                </div>
            );
        });
    }

    return (
        <div id="FriendList" className={props.className}>
            <h1>Friends</h1>
            {friends}
        </div>
    );
};

export default FriendList;
