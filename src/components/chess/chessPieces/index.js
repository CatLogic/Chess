import React from "react";
import "./chessPiece.sass";
import SvgPawn from "!svg-react-loader!./svg/pawn.svg";
import SvgRook from "!svg-react-loader!./svg/rook.svg";
import SvgKnight from "!svg-react-loader!./svg/knight.svg";
import SvgBishop from "!svg-react-loader!./svg/bishop.svg";
import SvgQueen from "!svg-react-loader!./svg/queen.svg";
import SvgKing from "!svg-react-loader!./svg/king.svg";

const ChessPiece = ({name, tagName, children, className, ...rest}) => (
    <div
        className={`chess-piece chess-piece--${name} chess-piece--${tagName} ${className || ""}`}
        {...rest}>
        {children}
    </div>
);

const Pawn = (props) => (<ChessPiece {...props}><SvgPawn/></ChessPiece>);
const Rook = (props) => (<ChessPiece {...props}><SvgRook/></ChessPiece>);
const Knight = (props) => (<ChessPiece {...props}><SvgKnight/></ChessPiece>);
const Bishop = (props) => (<ChessPiece {...props}><SvgBishop/></ChessPiece>);
const Queen = (props) => (<ChessPiece {...props}><SvgQueen/></ChessPiece>);
const King = (props) => (<ChessPiece {...props}><SvgKing/></ChessPiece>);

export default {
    "pawn": Pawn,
    "rook": Rook,
    "knight": Knight,
    "bishop": Bishop,
    "queen": Queen,
    "king": King
};
