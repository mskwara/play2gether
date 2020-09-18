import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chat.scss";
import UserContext from "../../../utils/UserContext";
import ConvContext from "../../../utils/ConvContext";
import SocketContext from "../../../utils/SocketContext";
import PopupContext from "../../../utils/PopupContext";
import ThemeContext from "../../../utils/ThemeContext";
import request from "../../../utils/request";
import Message from "./Message/Message";
import KeyboardEventHandler from "react-keyboard-event-handler";
import InfiniteScroll from "react-infinite-scroller";
import Loader from "../../Loader/Loader";

const Chat = (props) => {
    const userContext = useContext(UserContext);
    const convContext = useContext(ConvContext);
    const popupContext = useContext(PopupContext);
    const socketContext = useContext(SocketContext);
    const theme = useContext(ThemeContext);
    const activeUser = userContext.globalUserState.user;

    const [chatState, setChatState] = useState({
        messages: [],
        messageToSend: "",
    });

    const [infiniteScrollState, setInfiniteScrollState] = useState({
        hasMoreMessages: true,
        initialLoad: true,
        skip: 0,
    });

    const chatStateRef = useRef(chatState);
    const setChatStateAndRef = (data) => {
        chatStateRef.current = { ...chatStateRef.current, ...data };
        setChatState((chatState) => ({ ...chatState, ...data }));
    };

    const updateMessagesInState = (message) => {
        // console.log("log3", chatStateRef.current.messages);
        setInfiniteScrollState((infiniteScrollState) => ({
            ...infiniteScrollState,
            hasMoreMessages: false,
            initialLoad: false,
        }));
        const oldMessages = [...chatStateRef.current.messages, message];
        setChatStateAndRef({
            messages: oldMessages,
        });
        setInfiniteScrollState((infiniteScrollState) => ({
            ...infiniteScrollState,
            hasMoreMessages: true,
            // initialLoad: false,
        }));
        scrollToBottom();
    };

    const scrollToBottom = () => {
        const scrollable_content = document.getElementById("content");
        scrollable_content.scrollTop = scrollable_content.scrollHeight;
    };

    useEffect(() => {
        socketContext.socketState.socket.emit("join", {
            room: props.conv._id,
            private: !props.group,
            jwt: userContext.globalUserState.jwt,
        });
        socketContext.socketState.socket.on("chat", (message) => {
            console.log("on chat");
            if (message.conversation === props.conv._id) {
                updateMessagesInState(message);
            }
        });

        return () => {
            socketContext.socketState.socket.off("chat");
            setInfiniteScrollState((infiniteScrollState) => ({
                ...infiniteScrollState,
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
            private: !props.group,
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
        setInfiniteScrollState((infiniteScrollState) => ({
            ...infiniteScrollState,
            skip: infiniteScrollState.skip + 1,
        }));
        setChatStateAndRef({
            messageToSend: "",
        });
        // console.log(chatState.messages);
    };

    const handleTextAreaChange = (event) => {
        const messageToSend = event.target.value;
        if (messageToSend[messageToSend.length - 1] === "\n") {
            // prevent default behavior
            return;
        }
        setChatStateAndRef({
            messageToSend,
        });
    };

    const loadMoreMessages = async (page) => {
        console.log("page", page);
        const res = await request(
            "get",
            `http://localhost:8000/conversations/${
                props.group ? "group" : "private"
            }/${props.conv._id}/messages?page=${page}&skip=${
                infiniteScrollState.skip
            }`,
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
            console.log("messagesDownloadedReversed", messagesReversed);
            messagesReversed.push(...chatState.messages);
            // console.log(messagesReversed);
            setChatStateAndRef({
                messages: messagesReversed,
            });
            // scrollToBottom();
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
        <div
            id="Chat"
            style={{
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.chat,
            }}
        >
            <div
                className="topbar"
                style={{
                    borderBottom: `1px solid ${theme.colors.border}`,
                    color: theme.colors.primaryText,
                }}
            >
                {userBar}
                <img
                    src={require(`../../../assets/close.png`)}
                    alt="avatar"
                    className="close"
                    onClick={closeConv}
                    style={{ filter: theme.pngInvert() }}
                />
            </div>
            <div id="content">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMoreMessages}
                    hasMore={infiniteScrollState.hasMoreMessages}
                    loader={
                        <div className="loader">
                            <Loader />
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
            <div
                className="write-area"
                style={{ borderTop: `1px solid ${theme.colors.border}` }}
            >
                <textarea
                    placeholder="Write a message..."
                    rows="3"
                    id="textarea"
                    name="textarea"
                    value={chatState.messageToSend}
                    onChange={handleTextAreaChange}
                    style={{
                        backgroundColor: theme.colors.comment,
                        color: theme.colors.primaryText,
                    }}
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
