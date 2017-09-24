const {describe, it} = require('mocha');
const assert = require('assert');

require("./utils");
require("./grid");

describe("Chess pieces", function () {
    require("./chessPieces/pawn");
    require("./chessPieces/rook");
    require("./chessPieces/knight");
    require("./chessPieces/bishop");
    require("./chessPieces/queen");
    require("./chessPieces/king");
});

// todo: uncomplited
describe("In-game step tests", function () {
    const Chess = require('../src/chess').default;
    const chess = new Chess();

    chess.start();

    it("Prevent player from move wrong cp", () => {
        // Can move only currentPlayer cp
        assert.throws(() => {
                throw chess.move([1, 7], [1, 5])
            }, Error
        )
    });
    it("White pawn: \"a2\" => \"a3\"", () => {
        assert.equal(
            true,
            chess.move([1, 2], [1, 3]).valid
        );
    });
    it("Once moved pawn stepLength changed: 2 -> 1", () => {
        assert.equal(
            1,
            chess.grid.getCell([1,3]).piece.stepLength
        );
    });
    it("Pawn: \"a7\" => \"a5\"", () => {
        // black pawn: "a7" => "a5"
        assert.equal(
            true,
            chess.move([1, 7], [1, 5]).valid
        )
    });

    //todo: сделать еще несколько ходов и включить проверку на возможные ходы для других фигур
});