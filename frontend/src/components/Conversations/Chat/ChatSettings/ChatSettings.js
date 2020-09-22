import React, { useContext, useState } from "react";
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

    const [state, setState] = useState({
        name: props.name,
    });

    const updateConvsInApp = (newConv) => {
        const openedConvs = [...convContext.convState.openedConvs];
        const index = openedConvs.findIndex((el) => el._id === props.convId);
        openedConvs[index] = newConv;
        convContext.updateConvState({ openedConvs });

        const groupConvs = [...userContext.globalUserState.groupConversations];
        const index1 = groupConvs.findIndex((el) => el._id === props.convId);
        groupConvs[index1] = newConv;
        userContext.updateGlobalUserState({ groupConversations: groupConvs });
    };

    const handleInputChange = (event) => {
        const newVal = event.target.value;
        setState((state) => ({ ...state, name: newVal }));
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
        updateConvsInApp(res.data.data);
    };

    const participants = props.participants.map((participant) => (
        <div
            className="person"
            key={participant._id}
            onClick={() => kick(participant._id)}
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
            {participants}
        </div>
    );
};

export default ChatSettings;
