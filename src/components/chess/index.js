import React, {Component} from "react";
import classNames from "classnames";
import ChessUiHeader from "./header";
import ChessUiAside from "./aside";
import ChessUiBoardSection from "./boardSection/index";
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
        // todo clean the mess after redux implementation
        let self = this;
        let {chessApi, currentPlayer} = this.state;

        let apiPlayers = chessApi.getPlayers();
        let players = null;
        if (apiPlayers) {
            players = {};
            for (let playerName in apiPlayers) {
                let player = apiPlayers[playerName];
                players[player.getSide()] = {
                    isCurrent: player.getSide() === currentPlayer,
                    state: player.getState(),
                    chessPieces: player.getChessPieces(),
                };
            }
        }

        let actions = {
            collectPossibleSteps: (coords) => (chessApi.possibleMoves(coords)),
            move: (from, to) => {
                chessApi.move(from, to);
                this.setState({currentPlayer: chessApi.currentPlayerName()});
            },
            start: () => {
                chessApi.start();
                self.setState({gameState: chessApi.state, currentPlayer: chessApi.currentPlayerName()});
            }
        };


        return (
            <div className={classNames(
                "container", "chess-ui",
                "chess-ui--" + chessApi.state,
                currentPlayer ? "chess-ui--turn-of-" + currentPlayer : ""
            )}>
                <ChessUiHeader/>
                <div className="chess-ui__game-cols">
                    <div className="card chess-card chess-ui__game-wr">
                        <ChessUiBoardSection
                            cells={chessApi.grid.cells}
                            state={this.state.gameState}
                            currentPlayer={currentPlayer}
                            actions={actions}/>
                    </div>
                    {!!players && <ChessUiAside players={players}/>}
                </div>
            </div>
        );
    }
}

export default ChessUi;
