import React, { useContext } from "react";
import "./Message.scss";
import { formatDate } from "../../../../utils/methods";
import ThemeContext from "../../../../utils/ThemeContext";

const Message = (props) => {
    const theme = useContext(ThemeContext);

    let myMessage = false;
    let messageClass = "content";
    let timeClass = "time";
    if (props.message.from === props.activeUserId) {
        // it is my message
        messageClass += " my-message";
        timeClass += " my-message";
        myMessage = true;
    }

    return (
        <div id="Message">
            <div
                className={messageClass}
                style={{
                    backgroundColor: myMessage
                        ? theme.colors.message
                        : theme.colors.othersMessage,
                    color:
                        theme.selectedTheme === "light" && !myMessage
                            ? "black"
                            : "white",
                }}
            >
                <p>{props.message.message}</p>
                <div className={timeClass}>
                    <p>{formatDate(props.message.sentAt, "short")}</p>
                </div>
            </div>
        </div>
    );
};

export default Message;
