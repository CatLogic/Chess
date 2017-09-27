const {describe, it} = require('mocha');
const assert = require('assert');

describe("Bishop tests", function () {
    const ChessPiece = require('../../src/chess/chessPiece/chessPiece').default;
    const bishop = new ChessPiece('bishop', "white");

    describe("Bishop step checks", function () {
        it("[x:5,y:5]", () => {
            assert.equal(true, bishop.isValidStep([5, 5]))
        });
        it("[x:-2,y:2]", () => {
            assert.equal(true, bishop.isValidStep([-2, 2]))
        });
        it("[x:5,y:-2]:false", () => {
            assert.equal(false, bishop.isValidStep([5, -2]))
        });
    });
});