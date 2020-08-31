import React from "react";
import "./Message.scss";

const Message = (props) => {
    let messageClass = "content";
    if (props.message.from === props.activeUserId) {
        // it is my message
        messageClass += " my-message";
    }

    return (
        <div id="Message">
            <div className={messageClass}>
                <p>{props.message.message}</p>
            </div>
        </div>
    );
};

export default Message;
