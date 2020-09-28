import React, { useContext } from "react";
import "./FriendList.scss";
import UserContext from "../../utils/UserContext";
import PopupContext from "../../utils/PopupContext";
import ConvContext from "../../utils/ConvContext";
import ThemeContext from "../../utils/ThemeContext";
import MyButton from "../MyButton/MyButton";
import UserRow from "../UserRow/UserRow";
import request from "../../utils/request";

const FriendList = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const convContext = useContext(ConvContext);
    const theme = useContext(ThemeContext);
    const activeUser = userContext.globalUserState.user;
    const privateConversations = userContext.globalUserState.privateConversations.sort(
        (a, b) => {
            return new Date(b.recentActivity) - new Date(a.recentActivity);
        }
    );
    const groupConversations = userContext.globalUserState.groupConversations.sort(
        (a, b) => {
            return new Date(b.recentActivity) - new Date(a.recentActivity);
        }
    );

    const acceptFriend = async (received_friend) => {
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/users/${received_friend._id}/acceptFriend`,
            null,
            true
        );

        if (res.data.status === "success") {
            const convRes = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/conversations/private`,
                null,
                true
            );
            userContext.updateGlobalUserState({
                user: res.data.user,
                privateConversations: convRes.data.data,
            });
            popupContext.setAlertActive(
                true,
                `${received_friend.name} has been added to your friends!`
            );
        }
    };

    const ignoreFriend = async (received_friend) => {
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/users/${received_friend._id}/ignoreFriend`,
            null,
            true
        );

        if (res.data.status === "success") {
            const convRes = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/conversations/private`,
                null,
                true
            );
            userContext.updateGlobalUserState({
                user: res.data.data,
                privateConversations: convRes.data.data,
            });
            popupContext.setAlertActive(
                true,
                `${received_friend.name}'s friend request has been ignored!`
            );
        }
    };

    const openChat = async (conv) => {
        console.log(conv);
        const openedConvs = [...convContext.convState.openedConvs];
        if (openedConvs.filter((c) => c._id === conv._id).length > 0) {
            //this conv has been opened already
            const index = openedConvs.indexOf(conv);
            openedConvs.splice(index, 1);
        } else {
            openedConvs.push(conv);
            if (window.screen.width >= 1050 && openedConvs.length > 3) {
                openedConvs.splice(0, 1);
            } else if (
                window.screen.width >= 730 &&
                window.screen.width < 1050 &&
                openedConvs.length > 2
            ) {
                openedConvs.splice(0, 1);
            } else if (window.screen.width < 730 && openedConvs.length > 1) {
                openedConvs.splice(0, 1);
            }
        }
        convContext.updateConvState({ openedConvs });
    };

    let friends = null;
    let received = null;
    let groups = null;
    let content = null;
    if (activeUser) {
        if (!popupContext.group) {
            // loading private conversations
            // console.log(privateConversations);
            friends = privateConversations.map((conv) => {
                let friend;
                if (conv.user._id === activeUser._id) {
                    //correspondent to ten drugi
                    friend = conv.correspondent;
                } else {
                    //user to ten drugi
                    friend = conv.user;
                }
                return (
                    <UserRow
                        user={friend}
                        conv={conv}
                        btnName="message"
                        onClick={openChat}
                        key={conv._id}
                        style={{ color: "white" }}
                    />
                );
            });

            received = activeUser.receivedFriendRequests.map((pf) => {
                return (
                    <UserRow
                        user={pf}
                        // conv={conv}
                        isConv={false}
                        btnName="message"
                        key={pf._id}
                        style={{ color: "white" }}
                        className="received"
                        receivedReq={true}
                        acceptFriend={acceptFriend}
                        ignoreFriend={ignoreFriend}
                    />
                );
            });

            content = (
                <div>
                    <h1 className="title">Friends</h1>
                    {activeUser &&
                        activeUser.receivedFriendRequests.length > 0 && (
                            <p className="title small-title">
                                Received requests
                            </p>
                        )}
                    <div className="received-box">{received}</div>
                    {activeUser &&
                        activeUser.friends > 0 &&
                        activeUser.receivedFriendRequests > 0 && (
                            <p className="title small-title">Your friends</p>
                        )}
                    {friends}
                    {privateConversations.length === 0 &&
                        activeUser.receivedFriendRequests.length === 0 && (
                            <p className="title small-title empty-title">
                                Nothing to show...
                            </p>
                        )}
                </div>
            );
        } else {
            // loading group conversations
            groups = groupConversations.map((conv) => {
                return (
                    <UserRow
                        conv={conv}
                        btnName="message"
                        onClick={openChat}
                        key={conv._id}
                        group={true}
                        style={{ color: "white" }}
                        activeUserId={activeUser._id}
                        activeDotBorderColor="black"
                    />
                );
            });

            content = (
                <div>
                    <h1 className="title">Groups</h1>
                    <MyButton
                        onClick={() => {
                            popupContext.openDialogWindow("createGroup");
                            popupContext.setFriendsOpened(
                                !popupContext.friendsOpened,
                                true
                            );
                        }}
                        className="create-btn"
                    >
                        Create
                    </MyButton>
                    {groups}
                    {groupConversations.length === 0 && (
                        <p className="title small-title empty-title">
                            Nothing to show...
                        </p>
                    )}
                </div>
            );
        }
    }

    return (
        <div
            id="FriendList"
            className={props.className}
            style={{
                backgroundColor: theme.colors.friends,
                border: `1px solid ${theme.colors.border}`,
            }}
        >
            <img
                src={require("../../assets/white_right_arrow.png")}
                alt="close"
                className="dialog-button close_arrow"
                onClick={() =>
                    popupContext.setFriendsOpened(
                        !popupContext.friendsOpened,
                        popupContext.group
                    )
                }
            />
            <img
                src={require("../../assets/switch.png")}
                alt="friends/group"
                className="dialog-button switch-arrows"
                onClick={() =>
                    popupContext.setFriendsOpened(
                        popupContext.friendsOpened,
                        !popupContext.group
                    )
                }
            />
            {content}
        </div>
    );
};

export default FriendList;
