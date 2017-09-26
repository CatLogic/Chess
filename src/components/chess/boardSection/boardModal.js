import React from "react";
import classNames from "classnames";

const BoardModal = ({title, children, center, hoverOpaque, props}) => {
    return (
        <div className={
            classNames("chess-board-modal", "card",
                {
                    "chess-board-modal--center": center,
                    "chess-board-modal--hover-opaque": hoverOpaque
                },
                props && [...props.className])
        }>
            <div className="card-content">
                {title && (
                    <p className="title">{title}</p>
                )}
                {children}
            </div>
        </div>
    );
};

export default BoardModal;