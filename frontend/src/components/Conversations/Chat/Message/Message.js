import React from "react";
import "./Message.scss";
import { formatDate } from "../../../../utils/methods";

const Message = (props) => {
    let messageClass = "content";
    let timeClass = "time";
    if (props.message.from === props.activeUserId) {
        // it is my message
        messageClass += " my-message";
        timeClass += " my-message";
    }

    return (
        <div id="Message">
            <div className={messageClass}>
                <p>{props.message.message}</p>
            </div>
            <div className={timeClass}>
                <p>{formatDate(props.message.sentAt, "short")}</p>
            </div>
        </div>
    );
};

export default Message;
