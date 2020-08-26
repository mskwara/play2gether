import React, { useState, useEffect } from "react";
import Person from "../../components/Person/Person";
import Loader from "../../components/Loader/Loader";
import "./Game.scss";
import axios from "axios";

const Game = (props) => {
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

    let players = null;
    let gameBigTile = null;
    if (state.game !== null) {
        gameBigTile = (
            <div className="gameBigTile">
                <img
                    src={require("../../assets/valorant_banner.jpg")}
                    alt="banner"
                    className="banner"
                />
                <p className="title">{state.game.title}</p>
                <p className="description">{state.game.description}</p>
                <button className="participate">Participate</button>
            </div>
        );

        players = (
            <div className="players">
                <Person className="person" />
                <Person className="person" />
                <Person className="person" />
                <Person className="person" />
                <Person className="person" />
            </div>
        );
    }

    return (
        <div id="Game">
            {state.loading ? <Loader /> : null}
            {gameBigTile}
            {players}
        </div>
    );
};

export default Game;
