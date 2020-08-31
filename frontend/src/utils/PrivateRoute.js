import UserContext from "./UserContext";
import PopupContext from "./PopupContext";
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    if (!userContext.globalUserState.user) {
        popupContext.setAlertActive(true, `You have to be logged to get in!`);
    }
    return (
        <Route
            {...rest}
            render={(props) =>
                userContext.globalUserState.user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/" />
                )
            }
        />
    );
};

export default PrivateRoute;
