import React, { useState, useContext, useEffect } from "react";
// import MyInput from "../MyInput/MyInput";
import "./Profile.scss";
import request from "../../../utils/request";
import PopupContext from "../../../utils/PopupContext";
import UserContext from "../../../utils/UserContext";
import Loader from "../../Loader/Loader";
import Comment from "./Comment/Comment";

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
            console.log("effect");
            const res = await request(
                "get",
                `http://localhost:8000/users/${popupContext.profileUserId}`,
                null,
                true
            );
            const comRes = await request(
                "get",
                `http://localhost:8000/users/${popupContext.profileUserId}/comments`,
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
    }, []);

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
    // if (props.visible) {
    content = <Loader />;

    if (state.user && state.comments) {
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
                <div className="comments">
                    <h1>Comments</h1>
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
                    {state.loadingComment ? <Loader /> : null}
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
