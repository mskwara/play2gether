import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./views/Home";
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
                <Switch>
                    <Route path="/" exact component={Home} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
