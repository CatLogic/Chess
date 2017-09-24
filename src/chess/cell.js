import {cellCoordsToName} from "./chessUtils";

export default class Cell {
    constructor(coords, piece = null) {
        this.name = cellCoordsToName(coords);
        this.coords = coords;
        this.piece = piece;
    }

    getCoords () {
        return this.coords;
    }
    getPiece() {
        return this.piece;
    }

    clear() {
        let currentPiece = this.piece;
        this.piece = null;
        return currentPiece;
    }

    setPiece(piece) {
        let currentPiece = this.piece;
        this.piece = piece;
        return currentPiece;
    }
}
