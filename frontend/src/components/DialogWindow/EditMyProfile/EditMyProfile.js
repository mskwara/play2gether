import React, { useContext, useState, useEffect } from "react";
import "./EditMyProfile.scss";
import UserContext from "../../../utils/UserContext";
import PopupContext from "../../../utils/PopupContext";
import ThemeContext from "../../../utils/ThemeContext";
import MyInput from "../../MyInput/MyInput";
import MyButton from "../../MyButton/MyButton";
import MyFileInput from "../../MyFileInput/MyFileInput";
import Loader from "../../Loader/Loader";
import request from "../../../utils/request";
import { getPhotoFromAWS } from "../../../utils/methods";

const EditMyProfile = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const theme = useContext(ThemeContext);
    const activeUser = userContext.globalUserState.user;

    const [state, setState] = useState({
        name: activeUser.name,
        photo: require(`../../../assets/defaultUser.jpeg`),
        aboutMe: activeUser.aboutMe,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeUser.photo !== "defaultUser.jpeg") {
            getPhotoFromAWS(activeUser.photo, (photo) => {
                setState((state) => ({ ...state, photo }));
            });
        } else {
            setState((state) => ({
                ...state,
                photo: require(`../../../assets/defaultUser.jpeg`),
            }));
        }
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
        setLoading(true);
        // console.log("upload");
        const fileUploaded = event.target.files[0];
        let formData = new FormData();
        formData.append("photo", fileUploaded);
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/users/me`,
            formData,
            true
        );
        if (res.data.status === "success") {
            setState((state) => ({ ...state, photo: fileUploaded }));
            popupContext.setAlertActive(true, "Your avatar has been set!");
        } else {
            popupContext.setAlertActive(true, `${res.data.message}`);
        }
        setLoading(false);
    };

    const updateUser = async () => {
        setLoading(true);
        const body = {
            name: state.name,
            aboutMe: state.aboutMe,
        };

        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/users/me`,
            body,
            true
        );
        if (res.data.status === "success") {
            userContext.updateGlobalUserState({ user: res.data.data });
            popupContext.setAlertActive(true, "Your profile has beed updated!");
        } else {
            popupContext.setAlertActive(true, `Something went wrong!`);
        }
        setLoading(false);
    };

    let avatar;
    if (state.photo) {
        if (typeof state.photo === "string") {
            avatar = state.photo;
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
                    <textarea
                        placeholder="About me..."
                        rows="3"
                        id="aboutMe"
                        name="aboutMe"
                        value={state.aboutMe}
                        onChange={handleInputChange}
                        style={{
                            backgroundColor: theme.colors.comment,
                            color: theme.colors.primaryText,
                        }}
                    />
                    <MyButton onClick={updateUser}>Save</MyButton>
                    {loading ? <Loader /> : null}
                </div>
            </div>
        </div>
    );
};

export default EditMyProfile;
