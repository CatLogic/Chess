import React from "react";
import className from "classnames";
import "./styles.sass";

const PlayerInfoHeader = ({playerName, state}) => {
    return (
        <header className="player-info__header">
            <div className="player-info__header-item player-info__header-item--name">{playerName}</div>
            <div className="player-info__header-item player-info__header-item--state">
                {state === "safe" && (<span className="tag is-success">Safe</span>)}
                {state === "inCheck" && (<span className="tag is-warning">In check</span>)}
            </div>
        </header>
    );
};

const PlayerInfo = ({playerName, state, isCurrent}) => {
    const propsForHeader = {playerName, state, isCurrent};
    return (
        <div className={
            className(
                "card",
                "player-info",
                "player-info--" + playerName,
                {"player-info--current": isCurrent})
        }>
            <PlayerInfoHeader {...propsForHeader}/>
        </div>
    );
};

export default PlayerInfo;