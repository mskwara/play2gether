import React, { useContext } from "react";
import "./Person.scss";
import request from "../../utils/request";
import UserContext from "../../utils/UserContext";
import ConvContext from "../../utils/ConvContext";
import SocketContext from "../../utils/SocketContext";
import PopupContext from "../../utils/PopupContext";
import ThemeContext from "../../utils/ThemeContext";
import styled from "styled-components";

const Person = (props) => {
    const userContext = useContext(UserContext);
    const convContext = useContext(ConvContext);
    const socketContext = useContext(SocketContext);
    const popupContext = useContext(PopupContext);
    const theme = useContext(ThemeContext);
    const privateConversations =
        userContext.globalUserState.privateConversations;
    const addFriend = async () => {
        await request(
            "patch",
            `http://localhost:8000/users/${props.user._id}/addFriend`,
            null,
            true
        );
        popupContext.setAlertActive(
            true,
            `${props.user.name} has been invited to be your friend!`
        );
    };

    const openChat = () => {
        if (
            !userContext.globalUserState.user.friends.some(
                (f) => f._id === props.user._id
            )
        ) {
            console.log("Not implemented!");
            return null;
        }
        const conv = privateConversations.filter(
            (conv) =>
                conv.user._id === props.user._id ||
                conv.correspondent._id === props.user._id
        )[0];
        const openedConvs = [...convContext.convState.openedConvs];
        if (openedConvs.filter((c) => c._id === conv._id).length > 0) {
            //this conv has been opened already
            return;
        } else {
            openedConvs.push(conv);
        }
        convContext.updateConvState({ openedConvs });
        return conv;
    };

    const inviteToGame = () => {
        const conv = openChat();
        if (!conv) {
            console.log("Not implemented!");
            return;
        }
        socketContext.socketState.socket.emit("send", {
            message: `Hi! Would you like to play ${props.gameTitle} with me?`,
            jwt: userContext.globalUserState.jwt,
            room: conv._id,
            private: true,
        });
    };

    let addFriendButton = null;
    if (
        !userContext.globalUserState.user.friends.some(
            (f) => f._id === props.user._id
        ) &&
        !userContext.globalUserState.user.pendingFriendRequests.some(
            (f) => f._id === props.user._id
        ) &&
        !userContext.globalUserState.user.receivedFriendRequests.some(
            (f) => f._id === props.user._id
        )
    ) {
        //they are not friends and didn't invite each other
        addFriendButton = (
            <img
                src={require("../../assets/add_friend.png")}
                alt="button"
                className="btn"
                onClick={addFriend}
                style={{ filter: theme.pngInvert() }}
            />
        );
    }

    const StyledSlider = styled.div`
        &:hover > #user {
            background: ${
                theme.selectedTheme === "light"
                    ? "rgb(255,255,255,0.9)"
                    : "rgb(0,0,0,0.9)"
            };
        }

        &.slide-down:hover {
            // height: 200px;

            & > #buttons {
                background: ${
                    theme.selectedTheme === "light"
                        ? "rgb(255,255,255,0.9)"
                        : "rgb(0,0,0,0.9)"
                };
            }
    `;

    let buttons = null;
    let sliderClass = "slider";

    if (props.user._id !== userContext.globalUserState.user._id) {
        // jeśli nie najeżdżam na siebie samego
        buttons = (
            <div id="buttons" className="buttons">
                <img
                    src={require("../../assets/invite_to_game.png")}
                    alt="button"
                    className="btn"
                    onClick={inviteToGame}
                    style={{ filter: theme.pngInvert() }}
                />
                <img
                    src={require("../../assets/message.png")}
                    alt="button"
                    className="btn"
                    onClick={openChat}
                    style={{ filter: theme.pngInvert() }}
                />
                {addFriendButton}
            </div>
        );
        sliderClass += " slide-down";
    }

    return (
        <div id="Person" className={props.className}>
            <StyledSlider
                className={sliderClass}
                style={{ border: `1px solid ${theme.colors.border}` }}
            >
                <div
                    id="user"
                    className="user"
                    style={{ color: theme.colors.primaryText }}
                >
                    <p>{props.user.name}</p>
                </div>
                <img
                    src={require(`../../../../backend/static/users/${props.user.photo}`)}
                    alt="avatar"
                    onClick={() =>
                        popupContext.openDialogWindow("profile", {
                            profileUserId: props.user._id,
                        })
                    }
                />
                {buttons}
            </StyledSlider>
        </div>
    );
};

export default Person;
