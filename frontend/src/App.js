import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import Game from "./views/Game/Game";
import Topbar from "./components/Topbar/Topbar";
import "./App.scss";
// import axios from "axios";

const App = (props) => {
    // const [state, setState] = useState({
    //     message: "",
    // });
    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:8000/");
    //             setState((state) => ({
    //                 ...state,
    //                 message: res.data.message,
    //             }));
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getData();
    // }, []);
    return (
        <BrowserRouter>
            <div id="App">
                <Topbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/games/:gameId" exact component={Game} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
