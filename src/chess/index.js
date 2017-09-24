import {chessPiecesNames as cpNames, playerStatuses} from "./consts";
import {isSameCoords} from "./chessUtils";
import Player from "./player";
import Grid from "./grid";
import ChessPiece from "./chessPiece/chessPiece";

class Chess {
    constructor() {
        this.state = "pending";
        this.grid = new Grid();
        this.players = null;
        this.currentPlayer = null;
        //this.timer = false; // todo:optional
        //this.history = []; //todo:optional
    }

    start() {
        console.time("Start");
        this.players = {
            "white": new Player("white"),
            "black": new Player("black"),
        };
        this.currentPlayer = this.players.white;
        this.initDefaultGridState.call(this);
        this.state = "started";
        console.timeEnd("Start");
    }

    initDefaultGridState(){
        const chessPiecesOrder = [
            [cpNames.rook, cpNames.knight, cpNames.bishop, cpNames.queen, cpNames.king, cpNames.bishop, cpNames.knight, cpNames.rook],
            [cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn]
        ];

        const placeRow = (rowI, player) => {
            for (let colI = 1; colI <= 8; colI++) {
                let cpName = chessPiecesOrder
                    [(player.tagName === "white" ? rowI + 1 : rowI) % 2]
                    [colI - 1];
                let chessPiece = new ChessPiece(cpName, player.tagName);

                player.addPiece(chessPiece);
                this.grid.placePiece([colI, rowI], chessPiece);
            }
        };
        // White player
        for (let rowI = 1; rowI <= 2; rowI++) {
            placeRow(rowI, this.players.white)
        }
        // Black player
        for (let rowI = 7; rowI <= 8; rowI++) {
            placeRow(rowI, this.players.black)
        }
    }

    move(from, to) {
        let fromCell = this.grid.getCell(from);
        let cpOnFrom = fromCell.getPiece();

        if (!cpOnFrom) throw new Error("Nothing can`t be moved.");
        if (this.currentPlayer.getSide() !== cpOnFrom.getSide()) throw new Error("Players can move only their chess pieces.");

        let moveResult = this.grid.move( from, to);
        if (moveResult.valid) {
            this.currentPlayer = this.currentPlayer.tagName === "white" ?
                this.players["black"] :
                this.players["white"];

            if (moveResult.victim) this.currentPlayer.removePiece(moveResult.victim);
            this.checkPlayer();
        }
        return moveResult;
    }

    playerPossibleMoves(player) {
        const validSteps = new Set();
        const pieces = player.getChessPieces(true);

        pieces.forEach((piece) => {
            const coord = this.grid.getPieceCoords(piece);
            this.possibleMoves(coord).forEach((move) => {
                // Cell instance is unique, so their coordinates keep being the same array
                // and this is reason, why new Set() is a good data storage
                validSteps.add(move);
            });
        });
        return [...validSteps];
    }

    possibleMoves(coords) {
        if (this.state === "started") return this.grid.collectPossibleMoves(coords);
        else throw new Error("Nothing to collect. Game isn`t started.");
    }

    playerWon(winner){
        const winnerSide = winner.getSide();
        this.state = "finished";
        this.currentPlayer = null;
        this.players[winnerSide].setState("winner");
    }

    checkPlayer(playerName) {
        // By default:
        // opponentPlayer is who made last move
        // playerToCheck is who gonna move after this check
        const checkingPlayer = playerName ? this.players[playerName] : this.currentPlayer;
        const opponentPlayer = this.players[checkingPlayer === "white" ? "black" : "white"];
        const king = checkingPlayer.getKing();
        const kingCoords = this.grid.getPieceCoords(king);
        const kingMoves = this.possibleMoves(kingCoords);
        const opponentMoves = this.playerPossibleMoves(opponentPlayer);
        const playerToCheckStatus = {
            inDanger: false,
            canMove: !!kingMoves.length
        };

        opponentMoves.forEach(([x, y]) => {
            // in danger check
            if (isSameCoords([x, y], kingCoords)) playerToCheckStatus.inDanger = true;
        });

        if(playerToCheckStatus.inDanger && playerToCheckStatus.canMove) {
            checkingPlayer.setState(playerStatuses.checkmate);
        }
        else if(playerToCheckStatus.inDanger) checkingPlayer.setState(playerStatuses.check);
        else checkingPlayer.setState(playerStatuses.safe);
    }

    currentPlayerName() {
        if (this.state === "started") return this.currentPlayer ? this.currentPlayer.tagName : null;
        else throw new Error("Game isn`t started. Current player don`t exist.");
    }
}


export default Chess;