import React from "react";
import "./Message.scss";

const Message = (props) => {
    let messageClass = "content";
    let timeClass = "time";
    if (props.message.from === props.activeUserId) {
        // it is my message
        messageClass += " my-message";
        timeClass += " my-message";
    }

    const formatDate = (date, type) => {
        const localDate = new Date(date).toLocaleString();
        let result;
        switch (type) {
            case "short":
                result = localDate.substring(11, 16);
                break;
        }
        return result;
    };

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
