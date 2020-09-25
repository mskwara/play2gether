import React, { useEffect, useState, useContext } from "react";
import "./UserRow.scss";
import { getActiveDotColor } from "../../utils/methods";
import UserContext from "../../utils/UserContext";

const UserRow = (props) => {
    const userContext = useContext(UserContext);
    const activeUser = userContext.globalUserState.user;

    const [dotColor, setDotColor] = useState("");
    // const [notification, setNotification] = useState(false);
    useEffect(() => {
        if (props.isConv === false) {
            const color = getActiveDotColor(
                props.group,
                props.conv,
                props.activeUserId,
                props.user
            );
            setDotColor(color);
        } else {
            const color = getActiveDotColor(
                props.group,
                props.conv,
                props.activeUserId
            );
            setDotColor(color);
        }
    }, []);

    let notification;
    if (
        (props.conv &&
            !props.group &&
            activeUser.updatedPrivateConversations.includes(props.conv._id)) ||
        (props.group &&
            activeUser.updatedGroupConversations.includes(props.conv._id))
    ) {
        notification = <div className="notification-dot" />;
    }

    return (
        <div
            id={props.id}
            className={props.className + " UserRow"}
            style={props.style}
            onClick={() =>
                props.conv
                    ? props.onClick(props.conv)
                    : !props.receivedReq
                    ? props.onClick(props.user._id)
                    : null
            }
        >
            <span>
                {!props.group ? (
                    <img
                        src={require(`../../../../backend/static/users/${props.user.photo}`)}
                        alt="avatar"
                    />
                ) : (
                    <img
                        src={require(`../../assets/group.png`)}
                        alt="avatar"
                        className="group-avatar"
                    />
                )}
                <div
                    className="active-dot"
                    style={{
                        backgroundColor: dotColor,
                        borderColor: props.activeDotBorderColor
                            ? props.activeDotBorderColor
                            : "white",
                        display: dotColor === "red" ? "none" : "initial",
                    }}
                />
            </span>
            <p>
                {!props.group
                    ? props.user.name
                    : props.conv.name || "Brak nazwy :("}
            </p>
            {!props.receivedReq ? (
                <div className="actions" style={props.actionsStyle}>
                    <img
                        src={require(`../../assets/${props.btnName}.png`)}
                        alt="button"
                        className="btn"
                        style={props.btnStyle}
                    />
                </div>
            ) : (
                <div className="actions received-actions">
                    <img
                        src={require("../../assets/accept.png")}
                        alt="button"
                        className="btn received-btn"
                        onClick={() => props.acceptFriend(props.user)}
                    />
                    <img
                        src={require("../../assets/close.png")}
                        alt="button"
                        className="btn received-btn"
                        onClick={() => props.ignoreFriend(props.user)}
                    />
                </div>
            )}

            {notification}
        </div>
    );
};

export default UserRow;
