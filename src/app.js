import React from "react";
import "./general.sass";
import ChessUi from "./components/chess/";

const App = ()=>{
    return (
        <div className="app-wrapper">
            <ChessUi/>
        </div>
    );
};

export default App;