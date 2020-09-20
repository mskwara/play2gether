import React from "react";
import "./DialogWindow.scss";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import EditMyProfile from "./EditMyProfile/EditMyProfile";
import Profile from "./Profile/Profile";
import CreateGroup from "./CreateGroup/CreateGroup";

const DialogWindow = (props) => {
    let component = null;
    if (props.active) {
        if (props.component === "login") {
            component = <Login />;
        } else if (props.component === "signup") {
            component = <Signup />;
        } else if (props.component === "editMyProfile") {
            component = <EditMyProfile />;
        } else if (props.component === "profile") {
            component = <Profile />;
        } else if (props.component === "createGroup") {
            component = <CreateGroup />;
        }
    }

    return (
        <div id="DialogWindow" className={props.className}>
            {component}
        </div>
    );
};

export default DialogWindow;
