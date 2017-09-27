import React, {Component} from "react";
import {DropTarget} from "react-dnd";
import {dragType} from "../../../consts";

class Cell extends Component {

    render(){
        const {color, children, isMoveCandidate, isOver, connectDropTarget} = this.props;
        const cnBlock = "chess-board__cell";
        let className = cnBlock;
        className += color === "white" ? " chess-board__cell--white" : " chess-board__cell--black";
        if (isOver) className += ` ${cnBlock}--over`;
        if (isMoveCandidate) className += ` ${cnBlock}--possible-step`;

        return connectDropTarget(
            <div className={className}>{children}</div>
        );
    }
}

const dropSpec = {
    canDrop(props) {
        return props.isMoveCandidate;
    },
    drop(props, monitor) {
        props.validDropCallback(monitor.getItem().coords, props.coords);
    }
};

function collect(connect, monitor) {
    const isOver = monitor.isOver();
    return {
        connectDropTarget: connect.dropTarget(),
        isOver,
    };
}

export default DropTarget(dragType, dropSpec, collect)(Cell);