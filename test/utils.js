const {describe, it} = require('mocha');
const assert = require('assert');

describe("Utility function", function () {
    const utils = require("../src/chess/chessUtils");
    it("Char to integer: \"d\" => 3", () => {
        assert.equal(3, utils.cellCharToInt("d"));
    });
    it("Integer to char: 2 => \"b\"", () => {
        assert.equal("b", utils.intToAlpha(2));
    });
    it("Cell name to coordinate: \"a7\" => [1,7]", () => {
        assert.notStrictEqual([1, 7], utils.cellNameToCoords("a7"));
    });
    it("Cell name to coordinate: \"h2\" => [8,2]", () => {
        assert.notStrictEqual([8, 2], utils.cellNameToCoords("h2"));
    });
    it("Cell coordinates to name: [1,7] => \"a7\"", () => {
        assert.equal("a7", utils.cellCoordsToName([1, 7]));
    });
    it("Cell coordinates to name: [8,2] => \"h2\"", () => {
        assert.equal("h2", utils.cellCoordsToName([8, 2]));
    });
    it("getPathDif: a1 -> c3", () => {
        assert.notStrictEqual([2, 2],
            utils.getPathDif([1, 1], [3, 3])
        )
    });
});
