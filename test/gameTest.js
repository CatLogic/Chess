const {describe, it} = require('mocha');
const assert = require('assert');

// todo: uncomplited
describe("In-game step tests", function () {
    const Chess = require('../src/chess').default;
    const chess = new Chess();

    chess.start();

    it("Prevent player from move wrong cp(black pawn)", () => {
        // Can move only currentPlayer cp
        assert.throws(() => {
            throw chess.move([1, 7], [1, 5])
        }, Error)
    });
    it("W:Pawn: \"d2\" => \"d4\"", () => {
        assert.equal(
            true,
            chess.move([4, 2], [4, 4]).valid
        );
    });
    it("Once moved pawn stepLength changed: 2 -> 1", () => {
        let vectors = chess.grid.getCell([4, 4]).getPiece().getVectors();
        assert.equal(
            1,
            vectors[0].maxLength
        );
    });
    it("B:Pawn: \"a7\" => \"a5\"", () => {
        // black pawn: "a7" => "a5"
        assert.equal(
            true,
            chess.move([5, 7], [5, 5]).valid
        )
    });

    it("W:Pawn step on enemy pawn: \"a7\" => \"a5\"", () => {
        assert.equal(
            true,
            chess.move([4, 4], [5, 5]).valid
        )
    });

    it("Some other moves", () => {
        // B
        assert.equal(
            true,
            chess.move([7, 8], [8, 6]).valid
        );
        // W
        assert.equal(
            true,
            chess.move([5, 5], [5, 6]).valid
        );
        // B
        assert.equal(
            true,
            chess.move([6, 8], [2, 4]).valid
        )
    });
    // тут у белых шах

    //todo: сделать еще несколько ходов и включить проверку на возможные ходы для других фигур
});