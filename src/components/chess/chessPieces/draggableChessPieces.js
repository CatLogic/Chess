import React, {Component} from "react";
import {DragSource} from "react-dnd";
import {chessPiecesNames as cpNames, dragType} from "../../../consts";
import ChessPieces from "./index";

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    };
}

const dragSpec = {
    beginDrag(props) {
        props.collectPossibleSteps();
        return {
            name: props.name,
            coords: props.coords
        };
    },
    canDrag(props) {
        return props.isCurrentPlayerCP;
    },
    endDrag(props) {
        props.dropPossibleSteps();
    }
};

const DraggableHOC = DragSource(dragType, dragSpec, collect);

class DraggableCPWrapper extends Component {
    render() {
        const {connectDragSource, isDragging, name, tagName} = this.props;

        const ChessPiece = ChessPieces[name];
        let wrapperClassName = `cp-drag-wrapper ${isDragging ? "cp-drag-wrapper--drag" : ""}`;

        return connectDragSource(
            <div className={wrapperClassName}>
                <ChessPiece name={name} tagName={tagName}/>
            </div>
        );
    }
}


//todo убрать этот копипаст
export default {
    [cpNames.pawn]: DraggableHOC(DraggableCPWrapper),
    [cpNames.rook]: DraggableHOC(DraggableCPWrapper),
    [cpNames.knight]: DraggableHOC(DraggableCPWrapper),
    [cpNames.bishop]: DraggableHOC(DraggableCPWrapper),
    [cpNames.queen]: DraggableHOC(DraggableCPWrapper),
    [cpNames.king]: DraggableHOC(DraggableCPWrapper)
};
