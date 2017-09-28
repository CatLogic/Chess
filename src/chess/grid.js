import {cellCharToInt, vectorRay, containCoord} from "./chessUtils";
import {defaultVectorConfig} from "./consts";
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

    validateMove(from, to) {
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

        return true;
    }

    move(from, to) {
        let fromCell = this.getCell(from);
        let toCell = this.getCell(to);
        let cpOnFrom = fromCell.getPiece();
        let cpOnTo = toCell.getPiece();

        this.movePiece(from, to);
        cpOnFrom.moveCallback && cpOnFrom.moveCallback(toCell.coords);
        return {
            valid: true,
            victim: cpOnTo
        };
    }

    collectPossibleMoves(coords) {
        const fromCell = this.getCell(coords);
        const chessPiece = fromCell.getPiece();
        const validCells = [];

        chessPiece.vectors.forEach((name) => {
            this.vectorRayFacade(name, fromCell, function (cell) {
                const curCoords = cell.getCoords();
                validCells.push(curCoords);
            });
        });

        return validCells;
    }

    possibleWayTo(coords, checkCoords) {
        const fromCell = this.getCell(coords);
        const chessPiece = fromCell.getPiece();
        let wayTo = null;

        chessPiece.vectors.forEach((vector) => {
            const cells = [];
            let isValid = false;
            this.vectorRayFacade(vector, fromCell, function (cell) {
                const curCoords = cell.getCoords();
                cells.push(curCoords);
                if (containCoord(curCoords, checkCoords)) isValid = true;
            });

            if (isValid) wayTo = [coords].concat(cells);
        });

        return wayTo;
    }

    vectorRayFacade(vector, cell, callback) {
        let aConfig = this.assumptions;
        const vConfig = Object.assign(
            {}, defaultVectorConfig,
            typeof vector === "string" ? {name: vector} : vector
        );

        let coords = cell.getCoords();
        let chessPiece = cell.getPiece();
        let cpSide = chessPiece.getSide();

        let maxIterations = vConfig.maxLength || chessPiece.stepLength;
        let iteration = 0;

        vectorRay(vConfig.name, coords, (curCoords) => {
            if (maxIterations && iteration >= maxIterations) return false;
            const thisCell = this.getCell(curCoords);
            const thisCellPiece = thisCell.getPiece();
            let cellContain = thisCellPiece ?
                (thisCellPiece.getSide() === cpSide ? "ally" : "enemy") :
                null;

            if (aConfig) {
                if (aConfig.assumeAsEmpty && containCoord(curCoords, aConfig.assumeAsEmpty)) cellContain = null;
                if (aConfig.assumeAsEnemy && containCoord(curCoords, aConfig.assumeAsEnemy)) cellContain = "enemy";
            }

            if (cellContain === "ally") {
                if (vConfig.onAlly[0]) callback(thisCell);
                if (vConfig.onAlly[1]) return false;
            }
            else if (cellContain === "enemy") {
                if (vConfig.onEnemy[0]) callback(thisCell);
                if (vConfig.onEnemy[1]) return false;
            }
            else if (cellContain === null) {
                if (vConfig.onEmpty[0]) callback(thisCell);
                if (vConfig.onEmpty[1]) return false;
            }
            iteration++;
        });
    }

    removeAssumptions() {
        this.assumptions = null;
    }

    setAssumptions(assumption) {
        this.assumptions = assumption;
    }
}


export default Grid;