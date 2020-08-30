import React from "react";
import "./Chat.scss";

const Chat = (props) => {
    const a = "defaultUser.jpeg";
    return (
        <div id="Chat">
            <div className="topbar">
                <div className="user">
                    <div className="image">
                        <img
                            src={require(`../../../../../backend/static/users/${a}`)}
                            alt="avatar"
                        />
                        <div className="active-dot" />
                    </div>
                    <p>Michał Skwara</p>
                </div>
                <img
                    src={require(`../../../assets/close.png`)}
                    alt="avatar"
                    className="close"
                />
            </div>
            <div className="content">
                Hi hi hi, you cannot close me! I will cover 50% of your screen
                :P
            </div>
            <div className="write-area">
                <textarea placeholder="Write a message..." rows="3" />
                <img src={require(`../../../assets/send.png`)} alt="avatar" />
            </div>
        </div>
    );
};

export default Chat;
