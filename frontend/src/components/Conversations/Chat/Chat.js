import React, { useContext, useEffect, useState } from "react";
import "./Chat.scss";
import UserContext from "../../../utils/UserContext";
import ConvContext from "../../../utils/ConvContext";
import SocketContext from "../../../utils/SocketContext";
import request from "../../../utils/request";
import Message from "./Message/Message";

const Chat = (props) => {
    const userContext = useContext(UserContext);
    const convContext = useContext(ConvContext);
    const socketContext = useContext(SocketContext);
    const activeUser = userContext.globalUserState.user;

    const [chatState, setChatState] = useState({
        messages: [],
        messageToSend: "",
    });

    socketContext.socketState.socket.on("chat", (message) => {
        const oldMessages = [...chatState.messages];
        oldMessages.push(message);
        setChatState((chatState) => ({
            ...chatState,
            messages: oldMessages,
        }));
    });

    useEffect(() => {
        const getAllMessages = async () => {
            const res = await request(
                "get",
                `http://localhost:8000/conversations/${props.conv._id}/messages`,
                null,
                true
            );
            if (res.data.status === "success") {
                const messagesReversed = res.data.data.data.reverse();
                setChatState((chatState) => ({
                    ...chatState,
                    messages: messagesReversed,
                }));
            }
        };

        getAllMessages();

        // document.addEventListener("keydown", (e) => {
        //     if (e.which == 13 || e.keyCode === 13) {
        //         console.log("enter");
        //         sendMessage();
        //     }
        // });
        // Remove event listeners on cleanup
        // return () => {
        //     window.removeEventListener("keydown");
        // };
    }, [props.conv._id]);

    useEffect(() => {
        socketContext.socketState.socket.emit("join", {
            room: props.conv._id,
            jwt: userContext.globalUserState.jwt,
        });
    }, []);

    useEffect(() => {
        const scrollable_content = document.getElementById("content");
        scrollable_content.scrollTop = scrollable_content.scrollHeight;
    }, [chatState.messages]);

    const friend = props.conv.participants.filter(
        (person) => person._id !== activeUser._id
    )[0]; //get person which do you talk to

    const closeConv = () => {
        socketContext.socketState.socket.emit("leave", {
            room: props.conv._id,
            jwt: userContext.globalUserState.jwt,
        });
        const openedConvs = [...convContext.convState.openedConvs];
        const index = convContext.convState.openedConvs.indexOf(props.conv);
        openedConvs.splice(index, 1);
        convContext.updateConvState({ openedConvs });
    };

    const sendMessage = () => {
        socketContext.socketState.socket.emit("send", {
            message: chatState.messageToSend,
            jwt: userContext.globalUserState.jwt,
            room: props.conv._id,
        });
        // console.log(chatState.messages);

        // const messagesReversed = res.data.data.data.reverse();
        setChatState((chatState) => ({
            ...chatState,
            messageToSend: "",
        }));
        // console.log(chatState.messages);
    };

    const handleTextAreaChange = (event) => {
        const messageToSend = event.target.value;
        if (messageToSend[messageToSend.length - 1] === "\n") {
            // prevent default behavior
            return;
        }
        setChatState((chatState) => ({
            ...chatState,
            messageToSend,
        }));
    };

    let messages = null;
    if (chatState.messages.length > 0) {
        messages = chatState.messages.map((m) => (
            <Message message={m} activeUserId={activeUser._id} key={m._id} />
        ));
    }

    return (
        <div id="Chat">
            <div className="topbar">
                <div className="user">
                    <div className="image">
                        <img
                            src={require(`../../../../../backend/static/users/${friend.photo}`)}
                            alt="avatar"
                        />
                        <div className="active-dot" />
                    </div>
                    <p>{friend.name}</p>
                </div>
                <img
                    src={require(`../../../assets/close.png`)}
                    alt="avatar"
                    className="close"
                    onClick={closeConv}
                />
            </div>
            <div id="content">{messages}</div>
            <div className="write-area">
                <textarea
                    placeholder="Write a message..."
                    rows="3"
                    id="textarea"
                    name="textarea"
                    value={chatState.messageToSend}
                    onChange={handleTextAreaChange}
                />
                <img
                    src={require(`../../../assets/send.png`)}
                    alt="avatar"
                    onClick={sendMessage}
                />
            </div>
        </div>
    );
};

export default Chat;
