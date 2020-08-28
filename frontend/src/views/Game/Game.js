import React, { useState, useEffect, useContext } from "react";
import Person from "../../components/Person/Person";
import Loader from "../../components/Loader/Loader";
import AlertContext from "../../utils/AlertContext";
import "./Game.scss";
import axios from "axios";

const Game = (props) => {
    const alertContext = useContext(AlertContext);

    const [state, setState] = useState({
        game: null,
        loading: true,
    });
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/games/${props.match.params.gameId}`
                );
                setState((state) => ({
                    ...state,
                    game: res.data.data.data,
                    loading: false,
                }));
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    const setLoading = (val) => {
        setState((state) => ({
            ...state,
            loading: val,
        }));
    };

    const participate = async () => {
        setLoading(true);
        const res = await axios.post(
            `http://localhost:8000/games/${props.match.params.gameId}/membership`,
            null,
            {
                withCredentials: true,
            }
        );
        setState((state) => ({
            ...state,
            game: res.data.data.game,
        }));
        setLoading(false);
        alertContext.setAlertActive(
            true,
            "You have been added to the player's list!"
        );
    };

    const optout = async () => {
        setLoading(true);
        const res = await axios.patch(
            `http://localhost:8000/games/${props.match.params.gameId}/membership`,
            null,
            {
                withCredentials: true,
            }
        );
        setState((state) => ({
            ...state,
            game: res.data.data.game,
        }));
        setLoading(false);
        alertContext.setAlertActive(
            true,
            "You have been removed from the player's list!"
        );
    };

    let players = null;
    let gameBigTile = null;
    if (state.game !== null) {
        let button = (
            <button className="participate" onClick={participate}>
                Participate
            </button>
        );
        if (
            state.game.players.filter(
                (p) => p._id === localStorage.getItem("userId")
            ).length > 0
        ) {
            button = (
                <button className="participate" onClick={optout}>
                    Opt out
                </button>
            );
        }

        gameBigTile = (
            <div className="gameBigTile">
                <img
                    src={require("../../assets/valorant_banner.jpg")}
                    alt="banner"
                    className="banner"
                />
                <p className="title">{state.game.title}</p>
                <p className="description">{state.game.description}</p>
                {button}
            </div>
        );

        players = state.game.players.map((p) => {
            return <Person className="person" user={p} />;
        });
    }

    return (
        <div id="Game">
            {state.loading ? <Loader /> : null}
            <div className="content">
                {gameBigTile}
                <div className="players">{players}</div>
            </div>
        </div>
    );
};

export default Game;
