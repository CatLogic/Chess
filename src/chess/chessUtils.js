import {stepVectors} from "./consts";

export const cellCharToInt = (alpha) => (alpha[0].toLowerCase().charCodeAt(0) - 97);

export const intToAlpha = (int) => (String.fromCharCode(96 + int));

export const cellNameToCoords = (name) => ([cellCharToInt(name[0]) + 1, +name[1]]);

export const cellCoordsToName = (coords) => (intToAlpha(coords[0]) + coords[1]);

export const inBounds = ([x, y]) => {
    x = Math.abs(x);
    y = Math.abs(y);
    return (x >= 1 && x <= 8) && (y >= 1 && y <= 8);
};

export const isSameCoords = (c1, c2) => ((c1[0] === c2[0]) && (c1[1] === c2[1]));


export const getPathDif = (from, to) => {
    let fromCoords = from === "string" ? cellNameToCoords(from) : from;
    let toCoords = to === "string" ? cellNameToCoords(to) : to;
    return [toCoords[0] - fromCoords[0], toCoords[1] - fromCoords[1]];
};

export const vectorCheck = {
    [stepVectors.up]: ([x, y]) => (x === 0 && y > 0),
    [stepVectors.upRight]: ([x, y]) => (x > 0 && y > 0 && x === y),
    [stepVectors.right]: ([x, y]) => (x > 0 && y === 0),
    [stepVectors.downRight]: ([x, y]) => (x > 0 && y < 0 && x === y * -1),
    [stepVectors.down]: ([x, y]) => (x === 0 && y < 0),
    [stepVectors.downLeft]: ([x, y]) => (x < 0 && y < 0 && x === y),
    [stepVectors.left]: ([x, y]) => (x < 0 && y === 0),
    [stepVectors.upLeft]: ([x, y]) => (x < 0 && y > 0 && x * -1 === y),
    "diagonal": ([x, y]) => (Math.abs(x) === Math.abs(y)),
    "straight": ([x, y]) => ((x === 0 && y !== 0) || (x !== 0 && y === 0) ),
    "knight": ([x, y]) => {
        x = Math.abs(x);
        y = Math.abs(y);
        return (x === 2 && y === 1) || (x === 1 && y === 2);
    }
};

export const vectorNext = {
    [stepVectors.up]: ([x, y]) => [x, ++y],
    [stepVectors.upRight]: ([x, y]) => [++x, ++y],
    [stepVectors.right]: ([x, y]) => [++x, y],
    [stepVectors.downRight]: ([x, y]) => [++x, --y],
    [stepVectors.down]: ([x, y]) => [x, --y],
    [stepVectors.downLeft]: ([x, y]) => [--x, --y],
    [stepVectors.left]: ([x, y]) => [--x, y],
    [stepVectors.upLeft]: ([x, y]) => [--x, ++y],
    [stepVectors.knight]: ([x, y], i) => {
        ++i;
        let xAdd = 1;
        let yAdd = 1;
        let isOdd = i % 2;

        if (!isOdd) xAdd = 2;
        else yAdd = 2;
        if (i % 4 === 0) yAdd *= -1; //4,8
        if (i % 4 === 3) yAdd *= -1; // 3,7
        if (i % 4 === 2) xAdd *= -1; // 2,6
        if (i % 4 === 1) xAdd *= -1; // 1,5
        if (isOdd && (i - 1) % 3 === 0) xAdd *= -1; //4
        if (!isOdd && (i + 1) % 3 === 0) yAdd *= -1; //5

        return [x + xAdd, y + yAdd];
    }
};

export const vectorRay = function (vectorName, startPoint, callback) {
    let i = 0;
    let getNextVector = vectorNext[vectorName];
    let isKnight = vectorName === "knight";
    let currentPoint = startPoint;
    while (i < 8) {
        // Usually starting point isn`t required, so we immediately looking for next
        // But if its knight piece, we need only starting point and number of iteration
        currentPoint = getNextVector(isKnight ? startPoint : currentPoint, i);
        const outOfBounds = !inBounds(isKnight ? startPoint : currentPoint);
        if ((callback(currentPoint) === false) || outOfBounds) break;
        i++;
    }
};
