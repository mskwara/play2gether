import React, { useState, useContext, useEffect } from "react";
// import MyInput from "../MyInput/MyInput";
import "./Profile.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";
import Loader from "../../Loader/Loader";
import Comment from "./Comment/Comment";
import GameTile from "../../GameTile/GameTile";

const Profile = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);

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
                `http://localhost:8000/users/${popupContext.profileUserId}`,
                null,
                true
            );
            const comRes = await request(
                "get",
                `http://localhost:8000/comments/${popupContext.profileUserId}`, //TODO
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
            `http://localhost:8000/comments/${popupContext.profileUserId}`,
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
            <div className="content">
                <h1>Profile</h1>
                <img
                    src={require("../../../assets/close.png")}
                    alt="close"
                    className="close-btn"
                    onClick={popupContext.closeDialogWindow}
                />
                <div className="information">
                    <img
                        src={require(`../../../../../backend/static/users/${state.user.photo}`)}
                        alt="avatar"
                    />
                    <div className="description">
                        <p className="name">{state.user.name}</p>
                        {/* <p>{state.user.description}</p> */}
                        <p>
                            Jestem pajacem i mam pajacerski opis. Jestem pajacem
                            i mam pajacerski opis. Jestem pajacem i mam
                            pajacerski opis. Jestem pajacem i mam pajacerski
                            opis. Jestem pajacem i mam pajacerski opis. Jestem
                            pajacem i mam pajacerski opis. Jestem pajacem i mam
                            pajacerski opis. Jestem pajacem i mam pajacerski
                            opis.{" "}
                        </p>
                    </div>
                </div>
                <h1>Ready to play</h1>
                <div className="player-games">{playerGames}</div>
                <div className="comments">
                    <h1>Comments</h1>
                    {state.user._id !== userContext.globalUserState.user._id ? (
                        <span>
                            <textarea
                                placeholder="Write a new comment..."
                                rows="2"
                                id="textarea"
                                name="textarea"
                                value={state.newComment}
                                onChange={handleTextAreaChange}
                            />
                            <button onClick={sendComment}>Post</button>
                        </span>
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
