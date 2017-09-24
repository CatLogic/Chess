import checkStepCollection from "./checkers";
import chessConstructorFactory from "./cpFactory";

export default class ChessPiece {
    constructor(name = "pawn", side) {
        this.name = name;
        this.side = side;
        chessConstructorFactory(this);
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

    // todo переписать
    moveCallback(currentCoords) {
        if (this.name === 'pawn') this.stepLength = 1;
    }
}



