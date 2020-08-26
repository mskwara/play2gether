import React, { useState, useEffect } from "react";
import GameTile from "../../components/GameTile/GameTile";
import Loader from "../../components/Loader/Loader";
import "./Home.scss";
import axios from "axios";

const Home = (props) => {
    const [state, setState] = useState({
        games: null,
        loading: true,
    });
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:8000/games");
                setState((state) => ({
                    ...state,
                    games: res.data.data.data,
                    loading: false,
                }));
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    // transform games data to gameTile components
    let gameTiles = null;
    if (state.games !== null) {
        gameTiles = state.games.map((game) => (
            <GameTile history={props.history} game={game} key={game._id} />
        ));
    }

    return (
        <div id="Home">
            {state.loading ? <Loader /> : null}
            {gameTiles}
        </div>
    );
};

export default Home;
