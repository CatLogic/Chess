import {cellCharToInt, vectorRay} from "./chessUtils";
import Cell from "./cell";

class Grid {
    constructor() {
        this.setDefaultGrid();
        this.pieces = new Map();
    }

    setDefaultGrid() {
        const fields = [];
        for (let i = 0; i <= 7; i++) {
            fields[i] = [];
            for (let cellI = 7; cellI >= 0; cellI--) {
                fields[i].unshift(
                    new Cell([i + 1, cellI + 1])
                );
            }
        }
        this.cells = fields;
    }

    getCell(coords) {
        let xIndex = typeof coords[0] === "string" ?
            cellCharToInt(coords[0]) :
            coords[0] - 1;

        let yIndex = coords[1] - 1;
        return this.cells[xIndex] && this.cells[xIndex][yIndex];
    }

    getPieceCoords(chessPiece) {
        return this.pieces.get(chessPiece);
    }

    removePiece(chessPiece) {
        this.pieces.delete(chessPiece);
    }

    movePiece(from, to) {
        from = from instanceof Cell ? from : this.getCell(from);
        const movingPiece = from.getPiece();
        const removedPiece = this.placePiece(to, movingPiece);
        from.clear();
        removedPiece && this.removePiece(removedPiece);
    }

    placePiece(to, chessPiece) {
        const cell = to instanceof Cell ? to : this.getCell(to);
        const pieceOnCell = cell.getPiece();
        cell.setPiece(chessPiece);
        this.pieces.set(chessPiece, to);
        return pieceOnCell;
    }

    move(from, to) {
        let fromCell = this.getCell(from);
        let toCell = this.getCell(to);
        let cpOnFrom = fromCell.getPiece();
        let cpOnTo = toCell.getPiece();

        // Impossible to step on CP of acting player
        if (!!cpOnTo && cpOnFrom.getSide() === cpOnTo.getSide()) throw new Error("Player can`t attack his chess pieces.");
        // CP cant move here
        let coordsDif = [
            toCell.coords[0] - fromCell.coords[0],
            toCell.coords[1] - fromCell.coords[1],
        ];
        if (!cpOnFrom.isValidStep(coordsDif)) throw new Error("This chess piece cant move here.");

        /* Successful */
        this.movePiece(from, to);
        //todo remove callback
        cpOnFrom.moveCallback && cpOnFrom.moveCallback(toCell.coords);
        return {
            valid: true,
            victim: cpOnTo
        };
    }

    // todo: remove knight exception
    collectPossibleMoves(coords) {
        const fromCell = this.getCell(coords);
        const chessPiece = fromCell.getPiece();
        // Knight vector check is not really vector
        const isKnightException = chessPiece.getName() === "knight";
        const validCells = [];

        chessPiece.vectors.forEach((name) => {
            this.vectorRayFacade(name, fromCell, {
                shouldStopOnAlly: !isKnightException,
                shouldStopAfterEnemy: !isKnightException,
                onlyInBounds: !isKnightException,
                onCell: function (cell) {
                    const curCoords = cell.getCoords();
                    const isValidMove = chessPiece.isValidStep([
                        curCoords[0] - coords[0],
                        curCoords[1] - coords[1],
                    ]);

                    if (isValidMove) {
                        if (!isKnightException) {
                            validCells.push(curCoords);
                        } else {
                            let piece = cell.getPiece();
                            // Empty and valid cell
                            if (!piece) validCells.push(curCoords);
                            // Cell with enemy cp on it
                            else if (piece.getSide() !== chessPiece.getSide()) validCells.push(curCoords);
                        }
                    }
                    // Knight should do full vector loop because it`s not real vector ray
                    else if (!isKnightException) return false;
                }
            });
        });

        return validCells;
    }

    vectorRayFacade(vectorName, cell, options) {
        let {
            shouldStopOnAlly = true,
            shouldStopAfterEnemy = true,
            onCell: onCellCallback
        } = options;
        let coords = cell.getCoords();
        let chessPiece = cell.getPiece();
        let cpSide = chessPiece.getSide();
        let wasEnemyOnPrevCell = null;

        vectorRay(vectorName, coords, (curCoords) => {
            // Regularly loop stop on next iteration after enemy cp
            if (wasEnemyOnPrevCell && shouldStopAfterEnemy) return false;
            const thisCell = this.getCell(curCoords);
            if (thisCell) {
                const thisCp = thisCell.getPiece();

                if (thisCp) {
                    const isEnemy = cpSide !== thisCp.getSide();
                    // A CP of the same player blocking the way
                    if (!isEnemy && shouldStopOnAlly) return false;
                    // If we met enemy cp, we inform next iteration and it will break loop
                    if (isEnemy) wasEnemyOnPrevCell = true;
                }
                // If callback returns false, we break loop
                if (onCellCallback) {
                    const shouldBreak = onCellCallback(thisCell);
                    if (shouldBreak) return false;
                }
            }
        });
    }
}


export default Grid;