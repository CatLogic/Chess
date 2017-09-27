import {playerStatuses, cpNames} from "./consts";

class Player {
    constructor(side) {
        this.tagName = side;
        this.chessPieces = {};
        this.state = playerStatuses.safe;
    }

    getSide() {
        return this.tagName;
    }

    getState() {
        return this.state;
    }

    getChessPieces(united) {
        return !united ?
            this.chessPieces :
            [].concat(...Object.values(this.chessPieces));
    }

    getKing() {
        return this.chessPieces[cpNames.king][0];
    }

    setState(state){
        this.state = state;
    }

    addPiece(cp) {
        const type = cp.getName();
        if (!this.chessPieces[type]) this.chessPieces[type] = [];
        this.chessPieces[type].push(cp);
    }

    removePiece(cp) {
        const type = cp.getName();
        const typeCollection = this.chessPieces[type];
        return !typeCollection ? false : typeCollection.find((item, i) => {
            const isTarget = item === cp;
            if (isTarget) {
                this.chessPieces[type] = [].concat(
                    typeCollection.slice(0, i),
                    typeCollection.slice(i + 1)
                );
            }
            return isTarget;
        });
    }
}

export default Player;