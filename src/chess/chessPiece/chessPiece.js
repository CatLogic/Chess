import checkStepCollection from "./checkers";
import vectorConfigs from "./vectorConfigs";
import {stepVectors as vNames, cpNames} from "../consts";

function cpFactory() {
    this.vectors = typeof vectorConfigs[this.name] === "function" ?
        vectorConfigs[this.name](this.side) :
        vectorConfigs[this.name];
    if (this.name === cpNames.king || this.name === cpNames.pawn) this.stepLength = 1;
}

export default class ChessPiece {
    constructor(name, side) {
        this.name = name;
        this.side = side;
        cpFactory.call(this);
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
