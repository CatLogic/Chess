const {describe, it} = require('mocha');
const assert = require('assert');

require("babel-polyfill")


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

require("./gameTest");
