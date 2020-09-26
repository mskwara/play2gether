import React, { useContext, useEffect, useState } from "react";
import "./Comment.scss";
import { formatDate, getPhotoFromAWS } from "../../../../utils/methods";
import ThemeContext from "../../../../utils/ThemeContext";
import Radium from "radium";

const Comment = (props) => {
    const theme = useContext(ThemeContext);

    const [photo, setPhoto] = useState(
        require(`../../../../assets/defaultUser.jpeg`)
    );

    useEffect(() => {
        if (props.comment.from.photo !== "defaultUser.jpeg") {
            getPhotoFromAWS(props.comment.from.photo, (photo) => {
                setPhoto(photo);
            });
        } else {
            setPhoto(require(`../../../../assets/defaultUser.jpeg`));
        }
    }, []);

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
            <img src={photo} alt="avatar" />
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
