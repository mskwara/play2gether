import React, { useContext, useEffect, useState } from "react";
import "./ChatSettings.scss";
import ThemeContext from "../../../../utils/ThemeContext";
import ConvContext from "../../../../utils/ConvContext";
import UserContext from "../../../../utils/UserContext";
import request from "../../../../utils/request";
import MyInput from "../../../MyInput/MyInput";
import MyButton from "../../../MyButton/MyButton";

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
            `http://localhost:8000/conversations/group/${props.convId}`,
            { name: state.name },
            true
        );
        updateConvsInApp(res.data.data);
    };

    const kick = async (userId) => {
        const res = await request(
            "patch",
            `http://localhost:8000/conversations/group/${props.convId}/kick/${userId}`,
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
            `http://localhost:8000/conversations/group/${props.convId}`,
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
        <div
            className="person"
            key={participant._id}
            onClick={() => kick(participant._id)}
            style={friendStyle}
        >
            <img
                src={require(`../../../../../../backend/static/users/${participant.photo}`)}
                alt="avatar"
            />
            <p>{participant.name}</p>
            <div className="actions">
                <img
                    src={require("../../../../assets/remove.png")}
                    alt="button"
                    className="btn"
                />
            </div>
        </div>
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
        <div
            className="person"
            key={participant._id}
            onClick={() => add(participant._id)}
            style={friendStyle}
        >
            <img
                src={require(`../../../../../../backend/static/users/${participant.photo}`)}
                alt="avatar"
            />
            <p>{participant.name}</p>
            <div className="actions">
                <img
                    src={require("../../../../assets/add.png")}
                    alt="button"
                    className="btn"
                />
            </div>
        </div>
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
