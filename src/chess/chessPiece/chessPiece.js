import checkStepCollection from "./checkers";
import vectorConfigs from "./vectorConfigs";
import {stepVectors as vNames} from "../consts";

export default class ChessPiece {
    constructor(name = "pawn", side) {
        this.name = name;
        this.side = side;
        this.vectors = typeof vectorConfigs[name] === "function" ?
            vectorConfigs[name](side) :
            vectorConfigs[name];
    }

    isValidStep(coordDif) {
        if (checkStepCollection[this.name]) {
            const checker = checkStepCollection[this.name];
            return checker.call(this, coordDif);
        }
        return false;
    }

    getSide() {
        return this.side;
    }

    getName() {
        return this.name;
    }

    getVectors() {
        return this.vectors;
    }

    // Reasonable only for pawns,
    // but it is still not enough to use class to each piece
    moveCallback() {
        if (this.name === "pawn") {
            const vectorName = this.side === "white" ? vNames.up : vNames.down;
            this.vectors.find(v => v.name === vectorName).maxLength = 1;
        }
    }
}
