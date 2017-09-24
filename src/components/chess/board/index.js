import React, {Component} from "react";
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import "./board.sass";
import Cells from "./cells";

const Coordinates = ({vector, position}) => {
    const itemValues = vector === "vertical" ?
        [8, 7, 6, 5, 4, 3, 2, 1] :
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return (
        <div
            className={`chess-board__coords chess-board__coords--${vector} chess-board__coords--${position}`}>
            {itemValues.map((val) => (<div key={position + "_" + val} className="chess-board__coords-item">{val}</div>))
            }
        </div>
    )
};

class ChessUiBoard extends Component {
    render() {
        const {cells, actions, currentPlayer} = this.props;
        return (
            <div className="chess-board">
                <Coordinates vector="horizontal" position="top"/>
                <Coordinates vector="horizontal" position="bottom"/>
                <Coordinates vector="vertical" position="left"/>
                <Coordinates vector="vertical" position="right"/>
                <Cells cells={cells} currentPlayer={currentPlayer} actions={actions}/>
            </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(ChessUiBoard);
