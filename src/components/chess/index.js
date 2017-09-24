import React, {Component} from "react";
import ChessUiFooter from "./footer";
import ChessUiAside from "./aside";
import ChessUiBoard from "./board/";
import "./chess.sass";
import Chess from "../../chess/";

class ChessUi extends Component {
    constructor(props) {
        super(props);
        const chessApi = new Chess();
        this.state = {
            chessApi,
            gameState: "pending",
            currentPlayer: null
        };
    }

    render() {
        let self = this;
        let {chessApi, currentPlayer} = this.state;
        let actions = {
            start: () => {
                chessApi.start();
                self.setState({gameState: chessApi.state, currentPlayer: chessApi.currentPlayerName()});
            }
        };
        let boardActions = {
            collectPossibleSteps: (coords) => (chessApi.possibleMoves(coords)),
            move: (from, to) => {
                chessApi.move(from, to);
                this.setState({currentPlayer: chessApi.currentPlayerName()})
            }
        };


        let className = "container chess-ui";
        className += " chess-ui--" + chessApi.state;
        if (currentPlayer) className += " chess-ui--turn-of-" + currentPlayer;
        return (
            <div className={className}>
                <header className="chess-ui__header">
                    <h1>Chess</h1>
                    <p>Игра не предусматривает наличие "бота". Вам придётся играть самому с собой, либо позвать
                        соперника.</p>
                </header>

                <div className="chess-ui__game-cols">
                    <div className="card chess-card chess-ui__game-wr">
                        <ChessUiBoard cells={chessApi.grid.cells} currentPlayer={currentPlayer} actions={boardActions}/>
                        <ChessUiFooter state={chessApi.state} actions={actions}/>
                    </div>
                    <ChessUiAside/>
                </div>
            </div>
        );
    }
}

export default ChessUi;
