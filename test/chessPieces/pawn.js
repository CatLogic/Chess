const {describe, it} = require('mocha');
const assert = require('assert');

describe("Pawn tests", function () {
    const ChessPiece = require('../../src/chess/chessPiece/chessPiece').default;
    const whitePawn = new ChessPiece("pawn", "white");
    const blackPawn = new ChessPiece("pawn", "black");

    it("pawn vectors: [up]", () => {
        assert.equal(["up"].toString(), whitePawn.vectors.toString());
        assert.equal(["down"].toString(), blackPawn.vectors.toString());
    });
    it("pawn step length on start: 2", () => {
        assert.equal(2, whitePawn.stepLength)
    });

    describe("White pawn step checks", function () {
        it("[x:0,y:2]", () => {
            assert.equal(true, whitePawn.isValidStep([0, 2]))
        });
        it("[x:0,y:1]", () => {
            assert.equal(true, whitePawn.isValidStep([0, 1]))
        });
        it("[x:0,y:3]:false", () => {
            assert.equal(false, whitePawn.isValidStep([0, 3]))
        });
        it("[x:1,y:1]:false", () => {
            assert.equal(false, whitePawn.isValidStep([1, 1]))
        });
        it("[x:0,y:-1]:false", () => {
            assert.equal(false, whitePawn.isValidStep([0, -1]))
        });
    });

    describe("Black pawn step checks", function () {
        it("[x:0,y:-1]", () => {
            assert.equal(true, blackPawn.isValidStep([0, -1]))
        });
        it("[x:0,y:-2]", () => {
            assert.equal(true, blackPawn.isValidStep([0, -2]))
        });
        it("[x:0,y:-5]:false", () => {
            assert.equal(false, blackPawn.isValidStep([0, -5]))
        });
        it("[x:1,y:-1]:false", () => {
            assert.equal(false, blackPawn.isValidStep([1, -1]))
        });
        it("[x:0,y:1]:false", () => {
            assert.equal(false, blackPawn.isValidStep([0, 1]))
        });
    });
});