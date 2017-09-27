const {describe, it} = require('mocha');
const assert = require('assert');

describe("King tests", function () {
    const ChessPiece = require('../../src/chess/chessPiece/chessPiece').default;
    const king = new ChessPiece('king', "white");

    it("King step length on start: 1", () => {
        assert.equal(1, king.stepLength)
    });

    describe("King step checks", function () {
        it("[x:0,y:1]", () => {
            assert.equal(true, king.isValidStep([0, 1]))
        });
        it("[x:-1,y:0]", () => {
            assert.equal(true, king.isValidStep([-1, 0]))
        });
        it("[x:1,y:1]", () => {
            assert.equal(true, king.isValidStep([1, 1]))
        });
        it("[x:2,y:-2]:false", () => {
            assert.equal(false, king.isValidStep([2, -2]))
        });
    });
});