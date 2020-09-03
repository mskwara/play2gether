import React from "react";
import "./Comment.scss";

const Comment = (props) => {
    const photo = "defaultUser.jpeg";
    return (
        <div id="Comment">
            <img
                src={require(`../../../../../backend/static/users/${photo}`)}
                alt="avatar"
            />
            <p>{props.comment.comment}</p>
        </div>
    );
};

export default Comment;
