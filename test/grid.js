const {describe, it} = require('mocha');
const assert = require('assert');

describe("Grid", function () {
    const Grid = require('../src/chess/grid').default;
    const grid = new Grid();

    it("getCell: [1,1] == \"a1\"", () => {
        assert.equal("a1",
            grid.getCell([1, 1]).name
        );
    });
    it("getCell: [4,8] == \"d8\"", () => {
        assert.equal("d8",
            grid.getCell([4, 8]).name
        );
    });
    it("getCell: a1", () => {
        assert.equal("a1",
            grid.getCell("a1").name
        );
    });
    it("getCell: b4", () => {
        assert.equal("b4",
            grid.getCell("B4").name
        );
    });
    it("getCell: e4", () => {
        assert.equal("a1",
            grid.getCell([1, 1]).name
        )
    });
    it("getCell: h8", () => {
        assert.notStrictEqual([8, 8],
            grid.getCell([8, 8]).coords
        )
    });
});