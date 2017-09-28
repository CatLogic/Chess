import {cpNames as cpNames, playerStatuses} from "./consts";
import {containCoord} from "./chessUtils";
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
        if (this.state !== "started") throw new Error("Move isn`t possible. Game isn`t started.");

        // Preventing moves which gonna put actor king in danger
        this.beforeMove(from, to);

        let moveResult = this.grid.move(from, to);
        if (moveResult.valid) {
            this.switchPlayer();
            if (moveResult.victim) this.currentPlayer.removePiece(moveResult.victim);
            this.checkPlayer(this.currentPlayer);
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

        // Collecting enemy moves with predictions and compare with king coords
        let enemyMovesOnHisTurn = this.playerPossibleMoves(enemy, {assumeAsEmpty: [from], assumeAsEnemy: [to]});
        if (containCoord(actorKingCoords, enemyMovesOnHisTurn)) throw new Error("Players can`t move here. It will put hist king in danger.");

        // If player was in danger but moving to safe position, lets update his state
        if (actor.inDanger()) actor.setState(playerStatuses.safe);
        return true;
    }

    checkPlayer(checkingPlayer, oppositePlayer) {
        const opponentPlayer = oppositePlayer ||
            this.players[checkingPlayer.getSide() === "white" ? "black" : "white"];
        const king = checkingPlayer.getKing();
        const kingCoords = this.grid.getPieceCoords(king);
        const opponentMoves = this.playerPossibleMoves(opponentPlayer); // don`t provide details
        const inDanger = containCoord(kingCoords, opponentMoves);

        // todo: stalemate

        if (inDanger) {
            // Despite any further code, player at least gonna be "inCheck"
            checkingPlayer.setState(playerStatuses.inCheck);

            // Lets try to check if king able to help himself
            const kingMoves = this.possibleMoves(kingCoords);
            const kingSafeMoves = [];
            kingMoves.forEach((kMove) => {
                const isDangerousMove = containCoord(kMove, opponentMoves);
                if (!isDangerousMove) kingSafeMoves.push(kMove);
            });

            // king can help himself
            if (kingSafeMoves.length) {
                checkingPlayer.setState(playerStatuses.inCheck);
            } else {
                // King cant escape by just moving himself
                // First, lets figure out which piece(s) is cause of threat
                const sourceOfThreat = this.playerPossibleWaysTo(opponentPlayer, [kingCoords]);
                const checkingPlayerMoves = this.playerPossibleMoves(checkingPlayer);

                // If sourceOfThreat.length === 1,
                // Possibility to attack enemy piece or block its way
                if (sourceOfThreat.length === 1) {
                    const canPreventThread = !!sourceOfThreat[0].way.find((wayCoord) =>
                        containCoord(wayCoord, checkingPlayerMoves));
                    checkingPlayer.setState(
                        canPreventThread ?
                            playerStatuses.inCheck :
                            playerStatuses.checkmated
                    );
                } else if (sourceOfThreat.length >= 2) {
                    // In this case, we already know that king can`t move to save position
                    // but we also can`t attack 2 enemy pieces at time
                    checkingPlayer.setState(playerStatuses.checkmated);
                }
            }

            //todo decide to continue game or praise the winner
            //this.finishGame();
        }
        else checkingPlayer.setState(playerStatuses.safe);
    }

    playerPossibleMoves(player, assumption) {
        assumption && this.grid.setAssumptions(assumption);
        // todo: remove Set and use isSameCoords
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
        assumption && this.grid.removeAssumptions();
        return [...validSteps];
    }

    playerPossibleWaysTo(player, checkCoords) {
        const pieces = player.getChessPieces(true);
        const capablePieces = [];

        pieces.forEach(piece => {
            const coord = this.grid.getPieceCoords(piece);
            let way = this.possibleWaysTo(coord, checkCoords);
            way && capablePieces.push({pieceName: piece.getName(), coord, way});
        });

        return capablePieces;
    }

    possibleMoves(coords) {
        if (this.state === "started") return this.grid.collectPossibleMoves(coords);
        else throw new Error("Nothing to collect. Game isn`t started.");
    }

    possibleWaysTo(coords, checkCoords) {
        if (this.state === "started") return this.grid.possibleWayTo(coords, checkCoords);
        else throw new Error("Nothing to collect. Game isn`t started.");
    }

    finishGame() {
        alert("TODO: WIN");
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
