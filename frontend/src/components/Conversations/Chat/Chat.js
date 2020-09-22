import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chat.scss";
import UserContext from "../../../utils/UserContext";
import ConvContext from "../../../utils/ConvContext";
import SocketContext from "../../../utils/SocketContext";
import PopupContext from "../../../utils/PopupContext";
import ThemeContext from "../../../utils/ThemeContext";
import request from "../../../utils/request";
import Message from "./Message/Message";
import ChatSettings from "./ChatSettings/ChatSettings";
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
        loading: true && !props.conv.foreign,
        firstSendingToForeign: false,
        recentActivityColor: "red",
        settingsOpened: false,
    });

    const [infiniteScrollState, setInfiniteScrollState] = useState({
        hasMoreMessages: true && !props.conv.foreign,
        initialLoad: true && !props.conv.foreign,
        skip: 0,
    });

    const chatStateRef = useRef(chatState);
    const infiniteScrollStateRef = useRef(infiniteScrollState);
    const setChatStateAndRef = (data) => {
        chatStateRef.current = { ...chatStateRef.current, ...data };
        setChatState((chatState) => ({ ...chatState, ...data }));
    };

    const setInfiniteScrollStateAndRef = (data) => {
        infiniteScrollStateRef.current = {
            ...infiniteScrollStateRef.current,
            ...data,
        };
        setInfiniteScrollState((infiniteScrollState) => ({
            ...infiniteScrollState,
            ...data,
        }));
    };

    const updateMessagesInState = (message) => {
        const hasMoreOrNot = infiniteScrollStateRef.current.hasMoreMessages;
        // console.log(hasMoreOrNot);
        setInfiniteScrollStateAndRef({
            hasMoreMessages: false,
            initialLoad: false,
        });
        const oldMessages = [...chatStateRef.current.messages, message];
        setChatStateAndRef({
            messages: oldMessages,
        });
        setInfiniteScrollStateAndRef({
            hasMoreMessages: hasMoreOrNot,
            // initialLoad: false,
        });
        scrollToBottom();
    };

    const closeSettings = () => {
        setChatStateAndRef({ settingsOpened: false });
    };

    const scrollToBottom = () => {
        const scrollable_content = document.getElementById("content");
        scrollable_content.scrollTop = scrollable_content.scrollHeight;
    };

    useEffect(() => {
        if (!props.conv.foreign) {
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
        }
        if (props.conv.instantInvite) {
            console.log("INSTANT");
            sendMessage(props.conv.instantMessage);
        }

        return () => {
            socketContext.socketState.socket.off("chat");
            setInfiniteScrollStateAndRef({
                hasMoreMessages: true,
            });
        };
    }, []);

    useEffect(() => {
        if (!props.group) {
            const now = new Date();
            let hisRecentActivity;
            console.log(props.conv);
            if (props.conv.user._id === activeUser._id) {
                //correspondent to ten drugi
                hisRecentActivity = new Date(
                    props.conv.correspondent.recentActivity
                );
            } else {
                //user to ten drugi
                hisRecentActivity = new Date(props.conv.user.recentActivity);
            }
            const timeInSeconds =
                (now.getTime() - hisRecentActivity.getTime()) / 1000;
            let color = "red";
            if (timeInSeconds <= 60 * 5) {
                color = "green";
            } else if (timeInSeconds <= 60 * 15) {
                color = "yellow";
            }
            setChatStateAndRef({ recentActivityColor: color });
            // console.log(props.conv);
        }
    }, [props.conv]);

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

    const sendMessage = async (computedMessage = null) => {
        console.log("===========================");
        if (props.conv.foreign) {
            setChatStateAndRef({ firstSendingToForeign: true });
            const res = await request(
                "post",
                `http://localhost:8000/conversations/private/user/${props.conv.correspondent._id}`,
                null,
                true
            );
            if (res.data.status === "success") {
                console.log(res.data.conv);
                const newPrivateConvs = [
                    ...userContext.globalUserState.privateConversations,
                    res.data.conv,
                ];
                userContext.updateGlobalUserState({
                    privateConversations: newPrivateConvs,
                });
                const index = convContext.convState.openedConvs.indexOf(
                    props.conv
                );
                const openedConvs = [...convContext.convState.openedConvs];
                openedConvs.splice(index, 1, res.data.conv);
                // socketContext.socketState.socket.emit("send", {
                //     message: computedMessage
                //         ? computedMessage
                //         : chatState.messageToSend,
                //     jwt: userContext.globalUserState.jwt,
                //     room: res.data.conv._id,
                //     private: !props.group,
                // });
                await request(
                    "post",
                    `http://localhost:8000/conversations/private/${res.data.conv._id}`,
                    {
                        message: computedMessage
                            ? computedMessage
                            : chatState.messageToSend,
                    },
                    true
                );
                convContext.updateConvState({ openedConvs });
                setChatStateAndRef({ firstSendingToForeign: false });
                return;
            } else {
                popupContext.setAlertActive(
                    true,
                    "Sorry, there is a problem with the server..."
                );
                setChatStateAndRef({ firstSendingToForeign: false });
                return;
            }
        }
        socketContext.socketState.socket.emit("send", {
            message: computedMessage
                ? computedMessage
                : chatState.messageToSend,
            jwt: userContext.globalUserState.jwt,
            room: props.conv._id,
            private: !props.group,
        });
        // console.log(chatState.messages);

        // const messagesReversed = res.data.data.reverse();
        setInfiniteScrollStateAndRef({
            skip: infiniteScrollState.skip + 1,
        });
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
        if (props.conv.foreign) {
            return;
        }
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
                console.log("mniej niz 20");
                setInfiniteScrollStateAndRef({
                    hasMoreMessages: false,
                });
            }
            const messagesReversed = res.data.data.reverse();
            console.log("messagesDownloadedReversed", messagesReversed);
            messagesReversed.push(...chatStateRef.current.messages);
            // console.log(messagesReversed);
            setChatStateAndRef({
                messages: messagesReversed,
                loading: false,
            });
        }
        if (page === 1) {
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
                    <div
                        className="active-dot"
                        style={{
                            backgroundColor: chatState.recentActivityColor,
                        }}
                    />
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
                        onClick={() =>
                            setChatStateAndRef({ settingsOpened: true })
                        }
                        style={{ filter: theme.pngInvert() }}
                    />
                    <div
                        className="active-dot"
                        style={{
                            backgroundColor: chatState.recentActivityColor,
                        }}
                    />
                </div>
                <p>{props.conv.name || "Brak nazwy :("}</p>
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
                {props.group && chatState.settingsOpened ? (
                    <ChatSettings
                        name={props.conv.name}
                        participants={props.conv.participants}
                        convId={props.conv._id}
                        close={closeSettings}
                    />
                ) : null}
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
                {chatState.firstSendingToForeign ? (
                    <div>
                        <Loader className="loader" />
                    </div>
                ) : null}
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
                    {!chatState.loading &&
                    !chatState.firstSendingToForeign &&
                    chatState.messages.length === 0 ? (
                        <p
                            style={{
                                color: theme.colors.primaryText,
                                margin: "5px",
                            }}
                        >
                            Przywitaj się!
                        </p>
                    ) : (
                        messages
                    )}
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
                    onClick={() => sendMessage()}
                />
            </div>
            <KeyboardEventHandler
                handleKeys={["enter"]}
                handleFocusableElements={true}
                onKeyEvent={() => sendMessage()}
            />
        </div>
    );
};

export default Chat;
