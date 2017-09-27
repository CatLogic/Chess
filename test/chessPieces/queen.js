const {describe, it} = require('mocha');
const assert = require('assert');

describe("Queen tests", function () {
    const ChessPiece = require('../../src/chess/chessPiece/chessPiece').default;
    const queen = new ChessPiece('queen', "white");

    describe("Queen step checks", function () {
        it("[x:0,y:7]", () => {
            assert.equal(true, queen.isValidStep([0, 7]))
        });
        it("[x:-4,y:0]", () => {
            assert.equal(true, queen.isValidStep([-4, 0]))
        });
        it("[x:5,y:5]", () => {
            assert.equal(true, queen.isValidStep([5, 5]))
        });
        it("[x:-2,y:2]", () => {
            assert.equal(true, queen.isValidStep([-2, 2]))
        });
        it("[x:5,y:-2]:false", () => {
            assert.equal(false, queen.isValidStep([5, -2]))
        });
    });
});