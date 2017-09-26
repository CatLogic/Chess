import {stepVectors} from "./consts";

export const cellCharToInt = (alpha) => (alpha[0].toLowerCase().charCodeAt(0) - 97);

export const intToAlpha = (int) => (String.fromCharCode(96 + int));

export const cellNameToCoords = (name) => ([cellCharToInt(name[0]) + 1, +name[1]]);

export const cellCoordsToName = (coords) => (intToAlpha(coords[0]) + coords[1]);

export const inBounds = ([x, y]) => (x >= 1 && x <= 8) && (y >= 1 && y <= 8);

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

const vectorIterators = {
    "default": function* (startPoint, vName) {
        let current = startPoint;
        for (let valid = inBounds(current); valid; valid = inBounds(current)) {
            current = vectorNext[vName](current);
            yield current;
        }
    },
    "knight": function* (startPoint) {
        let current = startPoint;
        for (let i = 0; i <= 7; i++) {
            current = vectorNext["knight"](startPoint, i);
            if (inBounds(current)) yield current;
        }
    }
};

export const vectorRay = function (vectorName, startPoint, callback) {
    let iterator = vectorName !== "knight" ?
        vectorIterators.default(startPoint, vectorName) :
        vectorIterators.knight(startPoint);

    while (true) { // eslint-disable-line
        let {value, done} = iterator.next();
        if (done) break;
        if (!inBounds(value) || callback(value) === false) break;
    }
};