import {stepVectors as vNames, chessPiecesNames as cpNames} from "../consts";

/*
* Vector config example:
    {
        name: str,
        maxLength: int,
        onAlly: [isValid:false, shouldStop:true],
        onEnemy: [isValid:true, shouldStop:true],
        onEmpty: [isValid:false, shouldStop:true]
    }
* */

export default {
    [cpNames.pawn]: (side) => {
        const isWhite = side === "white";
        return [
            {
                name: isWhite ? vNames.up : vNames.down,
                maxLength: 2, // on 1st turn
                onEnemy: [false, true],
            },
            {
                name: isWhite ? vNames.upLeft : vNames.downLeft,
                onAlly: [false, true],
                onEnemy: [true, true],
                onEmpty: [false, true],
            },
            {
                name: isWhite ? vNames.upRight : vNames.downRight,
                onAlly: [false, true],
                onEnemy: [true, true],
                onEmpty: [false, true],
            }
        ];
    },
    [cpNames.knight]: [{
        name: vNames.knight,
        onAlly: [false, false],
        onEnemy: [true, false],
        onEmpty: [true, false],
    }],
    [cpNames.rook]: [
        vNames.up,
        vNames.right,
        vNames.down,
        vNames.left],
    [cpNames.bishop]: [
        vNames.upRight,
        vNames.downRight,
        vNames.downLeft,
        vNames.upLeft],
    [cpNames.queen]: [
        vNames.up,
        vNames.upRight,
        vNames.right,
        vNames.downRight,
        vNames.down,
        vNames.downLeft,
        vNames.left,
        vNames.upLeft
    ],
    [cpNames.king]: [
        vNames.up,
        vNames.upRight,
        vNames.right,
        vNames.downRight,
        vNames.down,
        vNames.downLeft,
        vNames.left,
        vNames.upLeft
    ]
};