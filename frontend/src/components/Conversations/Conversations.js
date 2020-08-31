import React, { useContext } from "react";
import "./Conversations.scss";
import Chat from "./Chat/Chat";
import ConvContext from "../../utils/ConvContext";

const Conversations = (props) => {
    const convContext = useContext(ConvContext);
    let chats = null;
    if (convContext.convState.openedConvs.length > 0) {
        chats = convContext.convState.openedConvs.map((conv) => (
            <Chat conv={conv} key={conv._id} />
        ));
    }

    return <div id="Conversations">{chats}</div>;
};

export default Conversations;
