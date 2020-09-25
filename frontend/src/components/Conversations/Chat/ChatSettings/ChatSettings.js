import React, { useContext, useEffect, useState } from "react";
import "./ChatSettings.scss";
import ThemeContext from "../../../../utils/ThemeContext";
import ConvContext from "../../../../utils/ConvContext";
import UserContext from "../../../../utils/UserContext";
import request from "../../../../utils/request";
import MyInput from "../../../MyInput/MyInput";
import MyButton from "../../../MyButton/MyButton";
import UserRow from "../../../UserRow/UserRow";

const ChatSettings = (props) => {
    const theme = useContext(ThemeContext);
    const convContext = useContext(ConvContext);
    const userContext = useContext(UserContext);
    const activeUser = userContext.globalUserState.user;

    const [state, setState] = useState({
        name: props.name,
        newFriend: "",
    });

    useEffect(() => {
        document.getElementById("content").scrollTo({ top: 0 });
    }, []);

    const updateConvsInApp = (newConv, leave = false) => {
        const openedConvs = [...convContext.convState.openedConvs];
        const index = openedConvs.findIndex((el) => el._id === props.convId);

        const groupConvs = [...userContext.globalUserState.groupConversations];
        const index1 = groupConvs.findIndex((el) => el._id === props.convId);

        if (leave) {
            openedConvs.splice(index, 1);
            groupConvs.splice(index1, 1);
        } else {
            openedConvs[index] = newConv;
            groupConvs[index1] = newConv;
        }
        convContext.updateConvState({ openedConvs });
        userContext.updateGlobalUserState({ groupConversations: groupConvs });
    };

    const handleInputChange = (event) => {
        const field = event.target.name;
        const newState = {
            ...state,
        };
        newState[field] = event.target.value;
        setState(newState);
    };

    const scrollToAddingFriend = () => {
        document
            .getElementById("filter-input")
            .scrollIntoView({ behavior: "smooth" });
    };

    const setName = async () => {
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/conversations/group/${props.convId}`,
            { name: state.name },
            true
        );
        updateConvsInApp(res.data.data);
    };

    const kick = async (userId) => {
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/conversations/group/${props.convId}/kick/${userId}`,
            null,
            true
        );
        if (userId === activeUser._id) {
            updateConvsInApp(res.data.data, true);
        } else {
            updateConvsInApp(res.data.data);
        }
    };

    const add = async (userId) => {
        console.log("add");
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/conversations/group/${props.convId}`,
            { name: props.name, newUsers: [userId] },
            true
        );
        updateConvsInApp(res.data.data);
    };

    const friendStyle = {
        backgroundColor: theme.colors.comment,
        color: theme.colors.primaryText,
        ":hover": {
            backgroundColor: theme.colors.commentHover,
        },
    };

    const participants = props.participants.map((participant) => (
        <UserRow
            user={participant}
            btnName="remove"
            onClick={kick}
            isConv={false}
            key={participant._id}
            style={friendStyle}
            actionsStyle={{ background: theme.colors.primaryText }}
            btnStyle={{
                filter:
                    theme.selectedTheme === "dark"
                        ? "none"
                        : "invert(1) hue-rotate(180deg)",
            }}
        />
    ));

    const filteredFriends = activeUser.friends.filter(
        (person) =>
            person.name
                .toLowerCase()
                .startsWith(state.newFriend.toLowerCase()) &&
            !props.participants.some(
                (participant) => participant._id === person._id
            )
    );
    const friendsToAdd = filteredFriends.map((participant) => (
        <UserRow
            user={participant}
            btnName="add"
            onClick={add}
            isConv={false}
            key={participant._id}
            style={friendStyle}
            actionsStyle={{ background: theme.colors.primaryText }}
            btnStyle={{
                filter:
                    theme.selectedTheme === "dark"
                        ? "none"
                        : "invert(1) hue-rotate(180deg)",
            }}
        />
    ));

    return (
        <div
            id="ChatSettings"
            style={{
                backgroundColor: theme.colors.profile,
                border: `1px solid ${theme.colors.border}`,
            }}
        >
            <h1>Settings</h1>
            <img
                src={require("../../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={props.close}
                style={{ filter: theme.pngInvert() }}
            />
            <img
                src={require("../../../../assets/add_friend.png")}
                alt="close"
                className="scroll-btn"
                onClick={scrollToAddingFriend}
                style={{ filter: theme.pngInvert() }}
            />
            <div id="content" className="content">
                <span>
                    <MyInput
                        type="text"
                        name="name"
                        placeholder="Chat name"
                        value={state.name}
                        labelId="name"
                        handleInputChange={handleInputChange}
                        className="input"
                    />
                    <MyButton className="set-btn" onClick={setName}>
                        Set
                    </MyButton>
                </span>
                <h1 className="small-title">Participants</h1>
                {participants}
                <div
                    className="divider"
                    style={{ borderBottom: `1px solid ${theme.colors.border}` }}
                    id="filter-input"
                />
                <MyInput
                    type="text"
                    name="newFriend"
                    placeholder="Find a friend"
                    value={state.newFriend}
                    labelId="newFriend"
                    handleInputChange={handleInputChange}
                    className="input"
                />
                {friendsToAdd}
            </div>
        </div>
    );
};

export default ChatSettings;
