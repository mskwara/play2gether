import React, { useContext, useState, useEffect } from "react";
import "./CreateGroup.scss";
import UserContext from "../../../utils/UserContext";
import PopupContext from "../../../utils/PopupContext";
import ConvContext from "../../../utils/ConvContext";
import ThemeContext from "../../../utils/ThemeContext";
// import MyFileInput from "../../MyFileInput/MyFileInput";
import Loader from "../../Loader/Loader";
import request from "../../../utils/request";
import MyButton from "../../MyButton/MyButton";
import Radium from "radium";
import MyInput from "../../MyInput/MyInput";
import UserRow from "../../UserRow/UserRow";

const CreateGroup = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const convContext = useContext(ConvContext);
    const theme = useContext(ThemeContext);
    const activeUser = userContext.globalUserState.user;

    const [loading, setLoading] = useState(false);
    const [usersState, setUsersState] = useState({
        users: [],
    });
    const [chatName, setChatName] = useState("");

    const userClick = (friendId) => {
        if (!usersState.users.includes(friendId)) {
            console.log("add", friendId);
            document.getElementById(friendId).classList.add("selected");
            setUsersState({ users: [...usersState.users, friendId] });
        } else {
            document.getElementById(friendId).classList.remove("selected");
            console.log("remove", friendId);
            const users = [...usersState.users];
            const index = users.indexOf(friendId);
            users.splice(index, 1);
            setUsersState({ users });
        }
    };

    const handleInputChange = (event) => {
        setChatName(event.target.value);
    };

    const create = async () => {
        setLoading(true);

        const res = await request(
            "post",
            "http://localhost:8000/conversations/group",
            { users: usersState.users, name: chatName },
            true
        );
        if (res.data.status === "success") {
            userContext.updateGlobalUserState({
                groupConversations: [
                    ...userContext.globalUserState.groupConversations,
                    res.data.data,
                ],
            });
            const openedConvs = [...convContext.convState.openedConvs];
            openedConvs.push(res.data.data);
            if (openedConvs.length > 3) {
                openedConvs.splice(0, 1);
            }
            convContext.updateConvState({ openedConvs });
            popupContext.closeDialogWindow();
            popupContext.setAlertActive(true, `The group has been created!`);
        } else {
            popupContext.setAlertActive(true, `Something went wrong!`);
        }

        setLoading(false);
    };

    const friendStyle = {
        backgroundColor: theme.colors.comment,
        color: theme.colors.primaryText,
        ":hover": {
            backgroundColor: theme.colors.commentHover,
        },
    };

    let friends;
    if (activeUser) {
        friends = activeUser.friends.map((friend) => {
            return (
                <UserRow
                    user={friend}
                    btnName="add"
                    onClick={userClick}
                    isConv={false}
                    key={friend._id}
                    id={friend._id}
                    style={friendStyle}
                    className="person"
                    actionsStyle={{ background: theme.colors.primaryText }}
                    btnStyle={{
                        filter:
                            theme.selectedTheme === "dark"
                                ? "none"
                                : "invert(1) hue-rotate(180deg)",
                    }}
                />
            );
        });
    }

    return (
        <div
            id="CreateGroup"
            style={{
                backgroundColor: theme.colors.profile,
                color: theme.colors.primaryText,
            }}
        >
            <h1>Create a group chat</h1>
            <img
                src={require("../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={popupContext.closeDialogWindow}
                style={{ filter: theme.pngInvert() }}
            />
            <div className="content">
                <div className="users-select">
                    {friends.length > 0
                        ? friends
                        : "You must have friends in order to create a group."}
                </div>
                <MyInput
                    className="input-name"
                    type="text"
                    name="name"
                    placeholder="Chat name"
                    value={chatName}
                    labelId="name"
                    handleInputChange={handleInputChange}
                />
                <MyButton onClick={create}>Create</MyButton>
                {loading ? <Loader /> : null}
            </div>
        </div>
    );
};

export default Radium(CreateGroup);
