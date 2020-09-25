import React, { useState, useContext, useEffect } from "react";
import MyButton from "../../MyButton/MyButton";
import "./Profile.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";
import ThemeContext from "../../../utils/ThemeContext";
import Loader from "../../Loader/Loader";
import Comment from "./Comment/Comment";
import GameTile from "../../GameTile/GameTile";

const Profile = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const theme = useContext(ThemeContext);

    const [state, setState] = useState({
        user: null,
        comments: [],
        newComment: "",
        loadingComment: false,
    });

    useEffect(() => {
        const getData = async () => {
            // console.log("effect");
            setState((state) => ({
                ...state,
                user: null,
                comments: null,
            }));
            const res = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/users/${popupContext.profileUserId}`,
                null,
                true
            );
            const comRes = await request(
                "get",
                `${process.env.REACT_APP_HOST}api/comments/${popupContext.profileUserId}`, //TODO
                null,
                true
            );
            setState((state) => ({
                ...state,
                user: res.data.data,
                comments: comRes.data.data,
            }));
        };
        // if (props.visible) {
        getData();
        // }
    }, [popupContext.profileUserId]);

    const handleTextAreaChange = (event) => {
        const newCom = event.target.value;
        setState((state) => ({
            ...state,
            newComment: newCom,
        }));
    };
    const setLoading = (val) => {
        setState((state) => ({
            ...state,
            loadingComment: val,
        }));
    };

    const sendComment = async () => {
        setLoading(true);
        const com = state.newComment;
        const res = await request(
            "post",
            `${process.env.REACT_APP_HOST}api/comments/${popupContext.profileUserId}`,
            { comment: com },
            true
        );
        setState((state) => ({
            ...state,
            comments: res.data.data,
            newComment: "",
        }));
        setLoading(false);
    };

    const praise = async (type) => {
        const data = {};
        data[type] = true;
        const res = await request(
            "patch",
            `${process.env.REACT_APP_HOST}api/users/${popupContext.profileUserId}`,
            data,
            true
        );
        if (res.data.status === "success") {
            setState((state) => ({
                ...state,
                user: res.data.data,
            }));
        }
    };

    let content = null;
    let comments = null;
    let playerGames = null;
    // if (props.visible) {
    content = <Loader />;

    if (state.user && state.comments) {
        playerGames = state.user.games.map((game) => (
            <GameTile
                game={game}
                key={game._id}
                size="small"
                className="game"
            />
        ));

        comments = state.comments.map((com) => (
            <Comment comment={com} key={com._id} />
        ));

        content = (
            <div
                className="content"
                style={{
                    backgroundColor: theme.colors.profile,
                    color: theme.colors.primaryText,
                    border: `1px solid ${theme.colors.border}`,
                }}
            >
                <h1>Profile</h1>
                <img
                    src={require("../../../assets/close.png")}
                    alt="close"
                    className="close-btn"
                    onClick={popupContext.closeDialogWindow}
                    style={{ filter: theme.pngInvert() }}
                />
                <div className="information">
                    <span
                        style={{
                            border: `1px solid ${theme.colors.primaryText}`,
                        }}
                    >
                        <img
                            src={require(`../../../../../backend/static/users/${state.user.photo}`)}
                            alt="avatar"
                        />
                        <div
                            className="praises"
                            style={{
                                backgroundColor: `${
                                    theme.selectedTheme === "light"
                                        ? "rgb(255,255,255,0.9)"
                                        : "rgb(0,0,0,0.9)"
                                }`,
                            }}
                        >
                            <span onClick={() => praise("friendly")}>
                                <img
                                    src={require("../../../assets/friendly.png")}
                                    alt="avatar"
                                    style={{ filter: theme.pngInvert() }}
                                />
                                <p className="value">{state.user.friendly}</p>
                                <div
                                    className="tooltip"
                                    style={{
                                        backgroundColor: `${
                                            theme.selectedTheme === "light"
                                                ? "rgb(255,255,255,0.9)"
                                                : "rgb(0,0,0,0.9)"
                                        }`,
                                    }}
                                >
                                    Friendly
                                </div>
                            </span>
                            <span onClick={() => praise("goodTeacher")}>
                                <img
                                    src={require("../../../assets/good_teacher.png")}
                                    alt="avatar"
                                    style={{ filter: theme.pngInvert() }}
                                />
                                <p className="value">
                                    {state.user.goodTeacher}
                                </p>
                                <div
                                    className="tooltip"
                                    style={{
                                        backgroundColor: `${
                                            theme.selectedTheme === "light"
                                                ? "rgb(255,255,255,0.9)"
                                                : "rgb(0,0,0,0.9)"
                                        }`,
                                    }}
                                >
                                    Good teacher
                                </div>
                            </span>
                            <span onClick={() => praise("skilledPlayer")}>
                                <img
                                    src={require("../../../assets/skilled_player.png")}
                                    alt="avatar"
                                    style={{ filter: theme.pngInvert() }}
                                />
                                <p className="value">
                                    {state.user.skilledPlayer}
                                </p>
                                <div
                                    className="tooltip"
                                    style={{
                                        backgroundColor: `${
                                            theme.selectedTheme === "light"
                                                ? "rgb(255,255,255,0.9)"
                                                : "rgb(0,0,0,0.9)"
                                        }`,
                                    }}
                                >
                                    Skilled player
                                </div>
                            </span>
                        </div>
                    </span>
                    <div className="description">
                        <p className="name">{state.user.name}</p>
                        <p>
                            {state.user.aboutMe !== "" &&
                            state.user.aboutMe !== undefined
                                ? state.user.aboutMe
                                : "Description is not provided."}
                        </p>
                    </div>
                </div>
                {playerGames.length > 0 ? <h1>Ready to play</h1> : null}
                <div className="player-games">{playerGames}</div>
                <div className="comments">
                    <h1>Comments</h1>
                    {state.user._id !== userContext.globalUserState.user._id ? (
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <span>
                                <textarea
                                    placeholder="Write a new comment..."
                                    rows="2"
                                    id="textarea"
                                    name="textarea"
                                    value={state.newComment}
                                    onChange={handleTextAreaChange}
                                    style={{
                                        border: `1px solid ${theme.colors.border}`,
                                        backgroundColor: theme.colors.comment,
                                        color: theme.colors.primaryText,
                                    }}
                                />
                                <MyButton onClick={sendComment}>Post</MyButton>
                            </span>
                            <div
                                className="divider"
                                style={{
                                    borderBottom: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>
                    ) : null}
                    {state.loadingComment ? <Loader /> : null}
                    {comments.length === 0 ? (
                        <p>There is nothing to show...</p>
                    ) : null}
                    {comments}
                </div>
            </div>
        );
    }
    // }

    return (
        <div id="Profile" className={props.className}>
            {content}
        </div>
    );
};

export default Profile;
