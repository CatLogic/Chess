// Chess class constants

export const cpNames = {
    pawn: "pawn",
    rook: "rook",
    knight: "knight",
    bishop: "bishop",
    queen: "queen",
    king: "king",
};

export const stepVectors = {
    up: "up",
    upRight: "upRight",
    right: "right",
    downRight: "downRight",
    down: "down",
    downLeft: "downLeft",
    left: "left",
    upLeft: "upLeft",
    knight: "knight",
};

export const defaultVectorConfig = {
    onAlly: [false, true], // isValidStep, shouldStop
    onEnemy: [true, true],
    onEmpty: [true, false],
};

export const playerStatuses = {
    safe: "safe",
    inCheck: "inCheck",
    checkmated: "checkmated",
    stalemate: "stalemate",
    winner: "winner",
    loser: "loser"
};
