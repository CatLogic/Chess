import React, {Component} from "react";

class ChessUiFooter extends Component {
    render() {
        const {actions, state} = this.props;
        let innerMarkUp;

        switch (state) {
            case("started"):{
                innerMarkUp = (
                    <div className="chess-ui__footer-inner chess-ui__footer--game-start">
                        Игра начата
                        <a className="button is-primary is-dark">Сдаться</a>
                        <a className="button is-primary is-info">Приостановить</a>
                    </div>
                );
                break;
            }

            case("finished"):
                innerMarkUp = (
                    <div className="chess-ui__footer-inner chess-ui__footer--game-start">
                        Игра закончена, вы можете начать новую:<br/>
                        <a className="button is-primary is-large">Начать игру</a>
                    </div>
                );
                break;

            default:
                innerMarkUp = (
                    <div className="chess-ui__footer-inner chess-ui__footer--game-start">
                        <a className="button is-primary is-large" onClick={() => {
                            actions.start();
                        }}>Начать игру</a>
                    </div>
                );
        }

        return (
            <footer className="card-content chess-ui__footer">
                {innerMarkUp}
            </footer>
        );
    }
}


export default ChessUiFooter;
