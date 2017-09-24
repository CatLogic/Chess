import {vectorCheck} from "../chessUtils";
import {chessPiecesNames as cpNames} from "../consts";

export default {
    [cpNames.pawn]: function ([x, y]) {
        let absY = Math.abs(y);
        if (!vectorCheck[this.vectors[0]]([x, y])) return false;
        if (absY > 0 && absY <= this.stepLength) return true;
        return false;
    },
    [cpNames.rook]: vectorCheck["straight"],
    [cpNames.knight]: vectorCheck["knight"],
    [cpNames.bishop]: vectorCheck["diagonal"],
    [cpNames.queen]: (coords) => (vectorCheck["diagonal"](coords) || vectorCheck["straight"](coords)),
    [cpNames.king]: ([x, y]) => {
        if (Math.abs(x) > 1 || Math.abs(y) > 1) return false;
        if (vectorCheck["diagonal"]([x, y]) || vectorCheck["straight"]([x, y])) return true;
        return false;
    }
};