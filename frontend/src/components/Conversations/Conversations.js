import React, { useContext } from "react";
import "./Conversations.scss";
import Chat from "./Chat/Chat";
import ConvContext from "../../utils/ConvContext";
import UserContext from "../../utils/UserContext";
// import SocketContext from "../../utils/SocketContext";

const Conversations = (props) => {
    const convContext = useContext(ConvContext);
    const userContext = useContext(UserContext);
    // const socketContext = useContext(SocketContext);
    let chats = null;

    if (convContext.convState.openedConvs.length > 0) {
        chats = convContext.convState.openedConvs.map((conv, index) => {
            // const itsSocketMessages = socketMessagesState.messages.filter(obj => obj.convId === conv._id)[0].socketMessages;
            if (conv.participants === null || conv.participants === undefined) {
                //private
                return <Chat conv={conv} key={conv._id} group={false} />;
            } else {
                return <Chat conv={conv} key={conv._id} group={true} />;
            }
        });
    }

    return (
        <div id="Conversations">
            {userContext.globalUserState.user ? chats : null}
        </div>
    );
};

export default Conversations;
