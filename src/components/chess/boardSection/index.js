import React from "react";
import ChessUiBoard from "../board/";
import BoardModal from "./boardModal";
import "./styles.sass";

const ChessUiBoardSection = (props) => {
    const {cells, currentPlayer, actions, state} = props;
    let Msg;

    if (state === "pending") {
        Msg = (
            <BoardModal title="Нажмите на кнопку что бы начать игру" center>
                <button className="button is-info is-large" onClick={actions.start}>Начать игру</button>
            </BoardModal>
        );
    } else if (state === "finished") {
        Msg = (
            <BoardModal title="Игра окончена" center hoverOpaque>
                <button className="button is-info is-large" onClick={actions.start}>Начать заново</button>
            </BoardModal>
        );
    }
    return (
        <div className="chess-board-wr">
            <ChessUiBoard cells={cells}
                          currentPlayer={currentPlayer}
                          actions={actions}/>
            {Msg}
        </div>
    );
};

export default ChessUiBoardSection;
