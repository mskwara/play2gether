import React, { useContext, useEffect, useState } from "react";
import "./Chat.scss";
import UserContext from "../../../utils/UserContext";
import ConvContext from "../../../utils/ConvContext";
import SocketContext from "../../../utils/SocketContext";
import PopupContext from "../../../utils/PopupContext";
import request from "../../../utils/request";
import Message from "./Message/Message";
import KeyboardEventHandler from "react-keyboard-event-handler";
import InfiniteScroll from "react-infinite-scroller";

const Chat = (props) => {
    const userContext = useContext(UserContext);
    const convContext = useContext(ConvContext);
    const popupContext = useContext(PopupContext);
    const socketContext = useContext(SocketContext);
    const activeUser = userContext.globalUserState.user;

    const [chatState, setChatState] = useState({
        messages: [],
        messageToSend: "",
    });

    const [infiniteScrollState, setInfiniteScrollState] = useState({
        hasMoreMessages: true,
        initialLoad: true,
    });

    const scrollToBottom = () => {
        const scrollable_content = document.getElementById("content");
        scrollable_content.scrollTop = scrollable_content.scrollHeight;
    };

    socketContext.socketState.socket.on("chat", (message) => {
        if (message.conversation === props.conv._id) {
            setInfiniteScrollState((infiniteScrollState) => ({
                ...infiniteScrollState,
                hasMoreMessages: false,
            }));
            const oldMessages = [...chatState.messages];
            oldMessages.push(message);
            setChatState((chatState) => ({
                ...chatState,
                messages: oldMessages,
            }));
            scrollToBottom();
            setInfiniteScrollState((infiniteScrollState) => ({
                ...infiniteScrollState,
                hasMoreMessages: false,
                initialLoad: false,
            }));
        }
    });

    useEffect(() => {
        socketContext.socketState.socket.emit("join", {
            room: props.conv._id,
            private: !props.group,
            jwt: userContext.globalUserState.jwt,
        });

        return () => {
            socketContext.socketState.socket.off("chat");
            setChatState((chatState) => ({
                ...chatState,
                hasMoreMessages: true,
            }));
        };
    }, []);

    // useEffect(() => {
    //     const scrollable_content = document.getElementById("content");
    //     scrollable_content.scrollTop = scrollable_content.scrollHeight;
    // }, [chatState.messages]);

    const closeConv = () => {
        socketContext.socketState.socket.emit("leave", {
            room: props.conv._id,
            private: true,
            jwt: userContext.globalUserState.jwt,
        });
        const openedConvs = [...convContext.convState.openedConvs];
        const index = convContext.convState.openedConvs.indexOf(props.conv);
        openedConvs.splice(index, 1);
        convContext.updateConvState({ openedConvs });
    };

    const sendMessage = () => {
        console.log("===========================");
        socketContext.socketState.socket.emit("send", {
            message: chatState.messageToSend,
            jwt: userContext.globalUserState.jwt,
            room: props.conv._id,
            private: !props.group,
        });
        // console.log(chatState.messages);

        // const messagesReversed = res.data.data.reverse();
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

    const loadMoreMessages = async (page) => {
        console.log("page", page);
        const res = await request(
            "get",
            `http://localhost:8000/conversations/${
                props.group ? "group" : "private"
            }/${props.conv._id}/messages?page=${page}`,
            null,
            true
        );
        if (res.data.status === "success") {
            if (res.data.results < 20) {
                setInfiniteScrollState((infiniteScrollState) => ({
                    ...infiniteScrollState,
                    hasMoreMessages: false,
                }));
            }
            const messagesReversed = res.data.data.reverse();
            messagesReversed.push(...chatState.messages);
            console.log(messagesReversed);
            setChatState((chatState) => ({
                ...chatState,
                messages: messagesReversed,
            }));
            scrollToBottom();
        }
    };

    let messages = null;
    if (chatState.messages.length > 0) {
        messages = chatState.messages.map((m) => (
            <Message message={m} activeUserId={activeUser._id} key={m._id} />
        ));
    }

    let friend;
    let userBar = null;
    if (!props.group) {
        if (props.conv.user._id === activeUser._id) {
            //correspondent to ten drugi
            friend = props.conv.correspondent;
        } else {
            //user to ten drugi
            friend = props.conv.user;
        }

        userBar = (
            <div className="user">
                <div className="image">
                    <img
                        src={require(`../../../../../backend/static/users/${friend.photo}`)}
                        alt="avatar"
                        onClick={() =>
                            popupContext.openDialogWindow("profile", {
                                profileUserId: friend._id,
                            })
                        }
                    />
                    <div className="active-dot" />
                </div>
                <p>{friend.name}</p>
            </div>
        );
    } else {
        userBar = (
            <div className="user">
                <div className="image">
                    <img
                        src={require(`../../../assets/group.png`)}
                        alt="avatar"
                    />
                    <div className="active-dot" />
                </div>
                <p>Nazwa konfy</p>
            </div>
        );
    }

    return (
        <div id="Chat">
            <div className="topbar">
                {userBar}
                <img
                    src={require(`../../../assets/close.png`)}
                    alt="avatar"
                    className="close"
                    onClick={closeConv}
                />
            </div>
            <div id="content">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMoreMessages}
                    hasMore={infiniteScrollState.hasMoreMessages}
                    loader={
                        <div className="loader" key={0}>
                            Loading ...
                        </div>
                    }
                    useWindow={false}
                    isReverse={true}
                    initialLoad={infiniteScrollState.initialLoad}
                    threshold={10}
                >
                    {messages}
                </InfiniteScroll>
            </div>
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
            <KeyboardEventHandler
                handleKeys={["enter"]}
                handleFocusableElements={true}
                onKeyEvent={sendMessage}
            />
        </div>
    );
};

export default Chat;
