import React, {Component} from "react";
import Cell from "./cell";
import ChessPieces from "../chessPieces/draggableChessPieces";

class Cells extends Component {
    constructor(props) {
        super(props);
        this.state = {
            possibleSteps: null
        };
    }

    render() {
        const {cells, currentPlayer, actions} = this.props;
        const {possibleSteps} = this.state;
        const cellsComponents = [];
        // [1,8], [2,8], [3,8], ... [8,1]
        for (let colI = 7; colI >= 0; colI--) {
            for (let rowI = 0; rowI <= 7; rowI++) {
                let thisCell = cells[rowI][colI];
                let coords = [rowI + 1, colI + 1]; // used for api
                let isMoveCandidate = possibleSteps &&
                    !!possibleSteps.find(([x, y]) => (x === coords[0] && y === coords[1] ));

                const ChessPiece = cpFactory(thisCell, {
                    coords,
                    currentPlayer,
                    collectPossibleSteps: () => {
                        const validSteps = actions.collectPossibleSteps(coords);
                        if (validSteps) this.setState({possibleSteps: validSteps});
                    },
                    dropPossibleSteps: () => {
                        this.setState({possibleSteps: null});
                    }
                });

                cellsComponents.push((<Cell
                    key={thisCell.name}
                    coords={coords}
                    color={(colI + rowI) % 2 ? "white" : "black"}
                    isMoveCandidate={isMoveCandidate}
                    validDropCallback={actions.move}
                >{ChessPiece}</Cell>));
            }
        }

        return (
            <div className="chess-board__cells">
                {cellsComponents.map(component => component)}
            </div>
        );
    }
}


function cpFactory(thisCell, props) {
    let {currentPlayer, ...rest} = props;
    let CPonCell = thisCell.piece ? ChessPieces[thisCell.piece.name] : false;
    if (!CPonCell) return false;

    const CPComponent = ChessPieces[thisCell.piece.name];
    const ChessPiece = (<CPComponent
        tagName={thisCell.piece.side}
        name={thisCell.piece.name}
        isCurrentPlayerCP={currentPlayer === thisCell.piece.side}
        {...rest}
    />);

    return ChessPiece;
}

export default Cells;