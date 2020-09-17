import React, { useContext } from "react";
import "./Comment.scss";
import { formatDate } from "../../../../utils/methods";
import ThemeContext from "../../../../utils/ThemeContext";
import Radium from "radium";

const Comment = (props) => {
    const theme = useContext(ThemeContext);

    return (
        <div
            id="Comment"
            style={{
                backgroundColor: theme.colors.comment,
                ":hover": {
                    backgroundColor: theme.colors.commentHover,
                },
            }}
        >
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

export default Radium(Comment);
