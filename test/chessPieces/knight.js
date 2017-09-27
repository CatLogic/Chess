const {describe, it} = require('mocha');
const assert = require('assert');

describe("Knight tests", function () {
    const ChessPiece = require('../../src/chess/chessPiece/chessPiece').default;
    const knight = new ChessPiece('knight', "white");

    describe("Knight step checks", function () {
        it("[x:2,y:1]", () => {
            assert.equal(true, knight.isValidStep([2, 1]))
        });
        it("[x:-1,y:-2]", () => {
            assert.equal(true, knight.isValidStep([-1,-2]))
        });
        it("[x:2,y:-2]:false", () => {
            assert.equal(false, knight.isValidStep([2, -2]))
        });
    });
});