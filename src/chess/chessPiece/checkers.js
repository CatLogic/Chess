import {vectorCheck} from "../chessUtils";
import {chessPiecesNames as cpNames} from "../consts";

export default {
    [cpNames.pawn]: function ([x, y]) {
        return this.vectors.some((vector) => {
            let vName = typeof vector === "string" ? vector : vector.name;
            let isValid = vectorCheck[vName]([x, y]);
            let maxLengthCondition = vector.maxLength ? Math.abs(y) <= vector.maxLength : true;
            return isValid && maxLengthCondition;
        });
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