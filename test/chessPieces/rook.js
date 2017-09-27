const {describe, it} = require('mocha');
const assert = require('assert');

describe("Rook tests", function () {
    const ChessPiece = require('../../src/chess/chessPiece/chessPiece').default;
    const rook = new ChessPiece('rook', "white");

    describe("Rook step checks", function () {
        it("[x:0,y:2]", () => {
            assert.equal(true, rook.isValidStep([0, 2]))
        });
        it("[x:5,y:0]", () => {
            assert.equal(true, rook.isValidStep([5,0]))
        });
        it("[x:2,y:3]:false", () => {
            assert.equal(false, rook.isValidStep([2, 3]))
        });
    });
});