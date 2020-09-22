import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import "./GameTile.scss";
import UserContext from "../../utils/UserContext";
import PopupContext from "../../utils/PopupContext";
import ThemeContext from "../../utils/ThemeContext";
import Radium from "radium";
import styled from "styled-components";

const GameTile = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const theme = useContext(ThemeContext);
    const history = useHistory();

    let bgImage = require(`../../assets/games/${props.game.icon}.jpg`);
    const tileStyle = {
        backgroundImage: `url(${bgImage})`,
        ":hover": {
            border: `3px solid ${theme.colors.primaryHover}`,
        },
    };
    if (props.size === "small") {
        tileStyle.width = "200px";
        tileStyle.minWidth = "200px";
        tileStyle.height = "240px";
        tileStyle.minHeight = "240px";
    }

    const tileClickHandler = () => {
        if (userContext.globalUserState.user) {
            // there is a logged user
            history.push({
                pathname: `/games/${props.game._id}`,
            });
            popupContext.closeDialogWindow();
        } else {
            popupContext.setAlertActive(
                true,
                `You have to be logged to get in!`
            );
        }
    };

    const StyledDescription = styled.div`
        &:hover {
            & > #description {
                background: ${theme.selectedTheme === "light"
                    ? "rgb(255,255,255,0.6)"
                    : "rgb(0,0,0,0.6)"};
            }
        }
    `;

    return (
        <StyledDescription
            id="GameTile"
            style={tileStyle}
            onClick={tileClickHandler}
            className={props.className}
        >
            {/* <h1>{props.game.title}</h1> */}
            <div
                id="description"
                className="description"
                style={{ color: theme.colors.primaryText }}
            >
                <p className="title">{props.game.title}</p>
                <p>{props.game.description}</p>
            </div>
        </StyledDescription>
    );
};

export default Radium(GameTile);
