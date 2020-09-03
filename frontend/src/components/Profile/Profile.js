import React, { useState, useContext, useEffect } from "react";
// import MyInput from "../MyInput/MyInput";
import "./Profile.scss";
import request from "../../utils/request";
import PopupContext from "../../utils/PopupContext";
import UserContext from "../../utils/UserContext";

const Profile = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);

    // const [userState, setUserState] = useState({
    //     name: "",
    //     email: "",
    //     password: "",
    //     passwordConfirm: "",
    // });

    // useEffect(() => {
    //     const getData = async () => {
    //         await request(
    //             "get",
    //             `http://localhost:8000/users/${props.user._id}`,
    //             null,
    //             true
    //         );

    //     }
    // }, [])

    return (
        <div id="Profile" className={props.className}>
            <div className="content">
                <h1>Profile {popupContext.profileUserId}</h1>
                <img
                    src={require("../../assets/close.png")}
                    alt="close"
                    className="close-btn"
                    onClick={() =>
                        popupContext.setProfileOpened(
                            false,
                            popupContext.profileUserId
                        )
                    }
                />
            </div>
        </div>
    );
};

export default Profile;
