import React, { useContext, useState, useEffect } from "react";
import "./Person.scss";
import request from "../../utils/request";
import UserContext from "../../utils/UserContext";
import ConvContext from "../../utils/ConvContext";
// import SocketContext from "../../utils/SocketContext";
import PopupContext from "../../utils/PopupContext";
import ThemeContext from "../../utils/ThemeContext";
import styled from "styled-components";
const { getPhotoFromAWS } = require("../../utils/methods");

const Person = (props) => {
    const userContext = useContext(UserContext);
    const convContext = useContext(ConvContext);
    // const socketContext = useContext(SocketContext);
    const popupContext = useContext(PopupContext);
    const theme = useContext(ThemeContext);
    const privateConversations =
        userContext.globalUserState.privateConversations;

    const [photo, setPhoto] = useState(
        require(`../../assets/defaultUser.jpeg`)
    );

    useEffect(() => {
        if (props.user.photo !== "defaultUser.jpeg") {
            getPhotoFromAWS(props.user.photo, (photo) => {
                setPhoto(photo);
            });
        } else {
            setPhoto(require(`../../assets/defaultUser.jpeg`));
        }
    }, []);

    const addFriend = async () => {
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/users/${props.user._id}/addFriend`,
            null,
            true
        );
        userContext.updateGlobalUserState({
            user: res.data.data,
        });
        popupContext.setAlertActive(
            true,
            `${props.user.name} has been invited to be your friend!`
        );
    };

    const openChat = (instantInvite = false) => {
        console.log(instantInvite);
        const openedConvs = [...convContext.convState.openedConvs];
        if (
            !privateConversations.some(
                (conv) =>
                    conv.user._id === props.user._id ||
                    conv.correspondent._id === props.user._id
            )
        ) {
            // there is no conversation yet
            // console.log("Not implemented!");
            const me = userContext.globalUserState.user;
            const foreignConv = {
                _id: me._id + props.user._id,
                user: {
                    _id: me._id,
                    name: me.name,
                    photo: me.photo,
                    recentActivity: me.recentActivity,
                },
                correspondent: {
                    _id: props.user._id,
                    name: props.user.name,
                    photo: props.user.photo,
                    recentActivity: props.user.recentActivity,
                },
                foreign: true,
            };
            if (
                openedConvs.filter((c) => c._id === foreignConv._id).length > 0
            ) {
                //this conv has been opened already
                return;
            }
            if (instantInvite) {
                foreignConv.instantInvite = true;
                foreignConv.instantMessage = `Hi! Would you like to play ${props.gameTitle} with me?`;
            }
            openedConvs.push(foreignConv);
            if (openedConvs.length > 3) {
                openedConvs.splice(0, 1);
            }
            convContext.updateConvState({ openedConvs });

            return foreignConv;
        } else {
            // there is a conversation already
            const conv = privateConversations.filter(
                (conv) =>
                    conv.user._id === props.user._id ||
                    conv.correspondent._id === props.user._id
            )[0];
            if (openedConvs.filter((c) => c._id === conv._id).length > 0) {
                //this conv has been opened already
                return;
            } else {
                if (instantInvite) {
                    conv.instantInvite = true;
                    conv.instantMessage = `Hi! Would you like to play ${props.gameTitle} with me?`;
                }
                openedConvs.push(conv);
                if (openedConvs.length > 3) {
                    openedConvs.splice(0, 1);
                }
            }
            convContext.updateConvState({ openedConvs });
            return conv;
        }
    };

    const inviteToGame = () => {
        if (
            !privateConversations.some(
                (conv) =>
                    conv.user._id === props.user._id ||
                    conv.correspondent._id === props.user._id
            )
        ) {
            // not friends
            // console.log("Not implemented!");
            openChat(true);
            return;
        } else {
            console.log("JEST TAKA KONFA");
            openChat(true);
            // socketContext.socketState.socket.emit("send", {
            //     message: `Hi! Would you like to play ${props.gameTitle} with me?`,
            //     jwt: userContext.globalUserState.jwt,
            //     room: conv._id,
            //     private: true,
            // });
        }
    };

    let addFriendButton = null;
    if (
        !userContext.globalUserState.user.friends.some(
            // nie jest moim friendem
            (f) => f._id === props.user._id
        ) &&
        !userContext.globalUserState.user.pendingFriendRequests.some(
            // nie wysłałem mu zaproszenia
            (f) => f._id === props.user._id
        ) &&
        !userContext.globalUserState.user.receivedFriendRequests.some(
            // nie otrzymałem zaproszenia
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
                    onClick={() => openChat(false)}
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
                    src={photo}
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
