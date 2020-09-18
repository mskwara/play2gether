import React, { useContext, useState, useEffect } from "react";
import "./EditMyProfile.scss";
import UserContext from "../../../utils/UserContext";
import PopupContext from "../../../utils/PopupContext";
import ThemeContext from "../../../utils/ThemeContext";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import MyFileInput from "../../MyFileInput/MyFileInput";
import request from "../../../utils/request";

const EditMyProfile = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const theme = useContext(ThemeContext);
    const activeUser = userContext.globalUserState.user;

    const [state, setState] = useState({
        name: "",
        photo: null,
        // description: "",
    });

    useEffect(() => {
        setState({
            name: activeUser.name,
            // description: activeUser.description,
            photo: activeUser.photo,
        });
    }, []);

    const handleInputChange = (event) => {
        const field = event.target.name;
        const newState = {
            ...state,
        };
        newState[field] = event.target.value;
        setState(newState);
    };

    const uploadFile = async (event) => {
        // console.log("upload");
        const fileUploaded = event.target.files[0];
        let formData = new FormData();
        formData.append("photo", fileUploaded);
        const res = await request(
            "patch",
            "http://localhost:8000/users/me",
            formData,
            true
        );
        if (res.data.status === "success") {
            setState((state) => ({ ...state, photo: fileUploaded }));
        } else {
            popupContext.setAlertActive(true, `${res.data.message}`);
        }
    };

    const updateUser = async () => {
        const body = {
            name: state.name,
        };

        const res = await request(
            "patch",
            "http://localhost:8000/users/me",
            body,
            true
        );
        if (res.data.status === "success") {
            userContext.updateGlobalUserState({ user: res.data.data });
        } else {
            popupContext.setAlertActive(true, `Something went wrong!`);
        }
    };

    let avatar;
    console.log(typeof state.photo);
    if (state.photo) {
        if (typeof state.photo === "string") {
            avatar = require(`../../../../../backend/static/users/${state.photo}`);
        } else {
            avatar = URL.createObjectURL(state.photo);
        }
    }

    return (
        <div
            id="EditMyProfile"
            style={{
                backgroundColor: theme.colors.profile,
                color: theme.colors.primaryText,
            }}
        >
            <h1>Your profile</h1>
            <img
                src={require("../../../assets/close.png")}
                alt="close"
                className="close-btn"
                onClick={popupContext.closeDialogWindow}
                style={{ filter: theme.pngInvert() }}
            />
            <div className="content">
                <span>
                    <img src={avatar} alt="avatar" />
                    <MyFileInput
                        uploadFile={uploadFile}
                        className="fileInput"
                    />
                </span>
                <div className="inputs">
                    <MyInput
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={state.name}
                        labelId="name"
                        handleInputChange={handleInputChange}
                    />
                    <MyButton onClick={updateUser}>Save</MyButton>
                </div>
            </div>
        </div>
    );
};

export default EditMyProfile;
