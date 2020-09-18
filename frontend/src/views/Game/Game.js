import React, { useState, useEffect, useContext } from "react";
import Person from "../../components/Person/Person";
import Loader from "../../components/Loader/Loader";
import PopupContext from "../../utils/PopupContext";
import ThemeContext from "../../utils/ThemeContext";
import MyButton from "../../components/MyButton/MyButton";
import "./Game.scss";
import request from "../../utils/request";
import UserContext from "../../utils/UserContext";

const Game = (props) => {
    const popupContext = useContext(PopupContext);
    const userContext = useContext(UserContext);
    const theme = useContext(ThemeContext);

    const [state, setState] = useState({
        game: null,
        players: null,
        loading: true,
    });

    const setLoading = (val) => {
        setState((state) => ({
            ...state,
            loading: val,
        }));
    };

    const getPlayersPlayingGame = async () => {
        setLoading(true);
        const playersRes = await request(
            "get",
            `http://localhost:8000/games/${props.match.params.gameId}/players`,
            null,
            true
        );

        setState((state) => ({
            ...state,
            players: playersRes.data.data,
            loading: false,
        }));
    };

    useEffect(() => {
        const getData = async () => {
            const res = await request(
                "get",
                `http://localhost:8000/games/${props.match.params.gameId}`,
                null,
                true
            );

            setState((state) => ({
                ...state,
                game: res.data.data,
            }));

            getPlayersPlayingGame();
        };
        getData();
    }, [props.match.params.gameId]);

    const participate = async () => {
        setLoading(true);
        const res = await request(
            "patch",
            `http://localhost:8000/games/${props.match.params.gameId}/registerAsPlayer`,
            null,
            true
        );

        userContext.updateGlobalUserState({ user: res.data.data });

        getPlayersPlayingGame();
        popupContext.setAlertActive(
            true,
            "You have been added to the player's list!"
        );
    };

    const optout = async () => {
        setLoading(true);
        const res = await request(
            "patch",
            `http://localhost:8000/games/${props.match.params.gameId}/optOut`,
            null,
            true
        );

        userContext.updateGlobalUserState({ user: res.data.data });

        getPlayersPlayingGame();
        popupContext.setAlertActive(
            true,
            "You have been removed from the player's list!"
        );
    };

    let players = null;
    let gameBigTile = null;
    if (state.game !== null && state.players !== null) {
        let button = (
            <MyButton className="participate" onClick={participate}>
                Participate
            </MyButton>
        );
        if (
            state.players.filter(
                (p) => p._id === userContext.globalUserState.user._id
            ).length > 0
        ) {
            button = (
                <MyButton className="participate" onClick={optout}>
                    Opt out
                </MyButton>
            );
        }

        gameBigTile = (
            <div
                className="gameBigTile"
                style={{
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.description,
                    color: theme.colors.primaryText,
                }}
            >
                <img
                    src={require("../../assets/valorant_banner.jpg")}
                    alt="banner"
                    className="banner"
                />
                <p className="title">{state.game.title}</p>
                <h1>DESCRIPTION:</h1>
                <p className="description">{state.game.description}</p>
                {button}
            </div>
        );
        const reversedPlayers = [...state.players];
        reversedPlayers.reverse();
        players = reversedPlayers.map((p) => {
            return (
                <Person
                    className="person"
                    user={p}
                    gameTitle={state.game.title}
                    key={p._id}
                />
            );
        });
    }

    return (
        <div id="Game">
            <div className="content">
                <div className="left-panel">
                    {gameBigTile}
                    {state.loading ? <Loader /> : null}
                </div>
                <div
                    className="players"
                    style={{ backgroundColor: theme.colors.description }}
                >
                    {players}
                </div>
            </div>
        </div>
    );
};

export default Game;
