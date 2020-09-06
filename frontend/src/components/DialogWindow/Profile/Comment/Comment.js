import React from "react";
import "./Comment.scss";
import { formatDate } from "../../../../utils/methods";

const Comment = (props) => {
    return (
        <div id="Comment">
            <img
                src={require(`../../../../../../backend/static/users/${props.comment.from.photo}`)}
                alt="avatar"
            />
            <div className="comment-content">
                <p className="name">{props.comment.from.name}</p>
                <p>{props.comment.comment}</p>
            </div>

            <div className="time">
                <p>{formatDate(props.comment.sentAt, "short")}</p>
            </div>
        </div>
    );
};

export default Comment;
