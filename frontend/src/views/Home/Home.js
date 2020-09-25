import React, { useState, useEffect } from "react";
import GameTile from "../../components/GameTile/GameTile";
import Loader from "../../components/Loader/Loader";
import "./Home.scss";
import request from "../../utils/request";

const Home = (props) => {
    const [state, setState] = useState({
        games: null,
        loading: true,
    });
    useEffect(() => {
        const getData = async () => {
            const res = await request(
                "get",
                `${process.env.REACT_APP_HOST}games`,
                null,
                false
            );

            setState((state) => ({
                ...state,
                games: res.data.data,
                loading: false,
            }));
        };
        getData();
    }, []);

    // transform games data to gameTile components
    let gameTiles = null;
    if (state.games !== null) {
        gameTiles = state.games.map((game) => (
            <GameTile game={game} key={game._id} />
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
