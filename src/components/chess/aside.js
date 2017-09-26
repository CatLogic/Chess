import React from "react";
import PlayerInfo from "./playerInfo";

const ChessUiAside = ({players}) => (
    <aside className="chess-ui__aside">
        <PlayerInfo {...players["white"]} playerName={"white"}/>
        <PlayerInfo {...players["black"]} playerName={"black"}/>
    </aside>
);

export default ChessUiAside;
