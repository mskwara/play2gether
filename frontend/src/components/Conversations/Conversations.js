import React from "react";
import "./Conversations.scss";
import Chat from "./Chat/Chat";

const Conversations = (props) => {
    return (
        <div id="Conversations">
            <Chat />
            <Chat />
            <Chat />
        </div>
    );
};

export default Conversations;
