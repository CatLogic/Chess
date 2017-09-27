import {cpNames as cpNames, playerStatuses} from "./consts";
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

    initDefaultGridState() {
        const chessPiecesOrder = [
            [cpNames.rook, cpNames.knight, cpNames.bishop, cpNames.queen, cpNames.king, cpNames.bishop, cpNames.knight, cpNames.rook],
            [cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn, cpNames.pawn]
        ];

        const placeRow = (rowI, player) => {
            for (let colI = 1; colI <= 8; colI++) {
                let cpName =
                    chessPiecesOrder[(player.getSide() === "white" ? rowI + 1 : rowI) % 2][colI - 1];
                let chessPiece = new ChessPiece(cpName, player.getSide());

                player.addPiece(chessPiece);
                this.grid.placePiece([colI, rowI], chessPiece);
            }
        };
        // White player
        for (let rowI = 1; rowI <= 2; rowI++) {
            placeRow(rowI, this.players.white);
        }
        // Black player
        for (let rowI = 7; rowI <= 8; rowI++) {
            placeRow(rowI, this.players.black);
        }
    }

    move(from, to) {
        // Preventing moves which gonna put actor king in danger
        this.beforeMove(from, to);

        let moveResult = this.grid.move(from, to);
        if (moveResult.valid) {
            this.switchPlayer();
            if (moveResult.victim) this.currentPlayer.removePiece(moveResult.victim);
            // Update opposite player status
            this.afterMove();
        }
        return moveResult;
    }

    beforeMove(from, to) {
        let actorSide = this.currentPlayer.getSide();
        let fromCell = this.grid.getCell(from);
        let cpOnFrom = fromCell.getPiece();

        /* Simple checks */
        if (!cpOnFrom) throw new Error("Nothing can`t be moved.");
        if (actorSide !== cpOnFrom.getSide()) throw new Error("Players can move only their chess pieces.");
        this.grid.validateMove(from, to);

        /* Checks based at assuming next player state */

        let actor = this.currentPlayer;
        let actorKing = actor.getKing();
        // If king acting we need to use "to" coordinates instead, to correct prediction
        let actorKingCoords = actorKing === cpOnFrom ? to : this.grid.getPieceCoords(actorKing);
        let enemy = actorSide === "white" ?
            this.getPlayers()["black"] :
            this.getPlayers()["white"];

        this.grid.setAssumptions({assumeAsEmpty: [from], assumeAsEnemy: [to]});
        let enemyMovesOnHisTurn = this.playerPossibleMoves(enemy);
        let willBeActorInDanger = enemyMovesOnHisTurn.find(c => isSameCoords(c, actorKingCoords));
        this.grid.removeAssumptions();
        if (willBeActorInDanger) throw new Error("Players can`t move here. It will put hist king in danger.");
        return true;
    }

    afterMove(playerName) {
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

        if (playerToCheckStatus.inDanger && playerToCheckStatus.canMove) {
            checkingPlayer.setState(playerStatuses.inCheck);
        }
        else if (playerToCheckStatus.inDanger) checkingPlayer.setState(playerStatuses.inCheck);
        else checkingPlayer.setState(playerStatuses.safe);
    }

    playerPossibleMoves(player) {
        const validSteps = new Set();
        const pieces = player.getChessPieces(true);

        pieces.forEach((piece) => {
            const coord = this.grid.getPieceCoords(piece);
            // Return cell instances
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

    /*playerWon(winner) {
        const winnerSide = winner.getSide();
        this.state = "finished";
        this.currentPlayer = null;
        this.players[winnerSide].setState("winner");
    }*/


    currentPlayerName() {
        if (this.state === "started") return this.currentPlayer ? this.currentPlayer.getSide() : null;
        else throw new Error("Game isn`t started. Current player don`t exist.");
    }

    getPlayers() {
        return this.players;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer.getSide() === "white" ?
            this.players["black"] :
            this.players["white"];
    }
}

export default Chess;
