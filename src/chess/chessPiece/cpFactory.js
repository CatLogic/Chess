import {stepVectors as vectorNames, chessPiecesNames as cpNames} from "../consts";

const vectorCPFactory = (name, side) => {
    let vectors;
    if (name === cpNames.pawn) {
        vectors = [side === "white" ? vectorNames.up : vectorNames.down];
    }
    else if (name === cpNames.knight) {
        vectors = [vectorNames.knight];
    }
    else if (name === cpNames.rook) {
        vectors = [
            vectorNames.up,
            vectorNames.right,
            vectorNames.down,
            vectorNames.left];
    } else if (name === cpNames.bishop) {
        vectors = [
            vectorNames.upRight,
            vectorNames.downRight,
            vectorNames.downLeft,
            vectorNames.upLeft];
    } else if (name === cpNames.queen || name === cpNames.king) {
        vectors = [
            vectorNames.up,
            vectorNames.upRight,
            vectorNames.right,
            vectorNames.downRight,
            vectorNames.down,
            vectorNames.downLeft,
            vectorNames.left,
            vectorNames.upLeft
        ];
    }
    return vectors;
};

const stepLengthFactory = (name) => {
    let forReturn;
    if (name === cpNames.pawn) forReturn = 2;
    else if (
        name === cpNames.bishop ||
        name === cpNames.queen ||
        name === cpNames.rook
    ) forReturn = 0;
    else if (name === cpNames.knight) forReturn = 3; // summary of 2 + 1 cells
    else if (name === cpNames.king) forReturn = 1;

    return forReturn;
};

export default (context) => {
    context.vectors = vectorCPFactory(context.name, context.side);
    context.stepLength = stepLengthFactory(context.name);
};