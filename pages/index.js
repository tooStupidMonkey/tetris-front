import React from 'react';
import _ from 'lodash';
import styles from '../assets/scss/style.scss';
import Block from '../assets/js/components/Block';
import Line from '../assets/js/components/Line';
import DefaultStates from '../assets/js/default/';
import removeFirstAndlastElement from '../assets/js/helpers/remover';

class Index extends React.Component {
    state = {
        activeFigureIndex: 0,
        canPlay: true,
        score: 0,
        bottomStructure: [],
        active: [4, 5, 6],
        autoMove: null,
        currentFigure: 0,
        filledLineMarker: [],
        allowedFigures: [],
        showScore: false
    }

    componentDidMount () {
        this._createGame();
        document.addEventListener('keydown', this._keyBoardEvent, false);
    }

    _initGame = () => {
        this._changeFigure();
        this.setState({
            autoMove: setInterval(() => this._moveDown(), 1000),
            showScore: false
        });
    }
    _createGame = () => {
        const { fieldHeight, fieldWidth } = DefaultStates;
        let filledLineMarker = [];
        for (let i = 0; i < fieldHeight; i++) {
            let line = [];
            for (let j = 0; j < fieldWidth; j++) {
                line.push(Number(String(i) + j));
            }
            filledLineMarker.push(removeFirstAndlastElement(line));
        }
        this.setState({ filledLineMarker });
        this._initGame();
    }
    _destractGame = () => {
        const { autoMove } = this.state;
        clearInterval(autoMove);
    }

    _restartGame = () => {
        this.setState({
            bottomStructure: [],
            score: 0,
            autoMove: setInterval(() => this._moveDown(), 1000),
            showScore: false
        });
    }

    componentDidUpdate () {
        this._checkLine();
    }

    _moveLeft = () => {
        const { allowedFigures, activeFigureIndex, bottomStructure } = this.state;
        const { incatives } = DefaultStates;
        let newAllowedFigures = [ ...allowedFigures ];
        newAllowedFigures = newAllowedFigures.map((item) => item.map((figure) => figure - 1));
        if (_.intersection(newAllowedFigures[activeFigureIndex], incatives.concat(bottomStructure)).length > 0) {
            return false;
        }
        this.setState({ allowedFigures: newAllowedFigures, active: newAllowedFigures[activeFigureIndex] });
    }

    _moveRight = () => {
        const { activeFigureIndex, allowedFigures, bottomStructure } = this.state;
        const { incatives } = DefaultStates;
        let newAllowedFigures = allowedFigures;
        newAllowedFigures = newAllowedFigures.map((item) => item.map((figure) => figure + 1));
        if (_.intersection(newAllowedFigures[activeFigureIndex], incatives.concat(bottomStructure)).length > 0) {
            return false;
        }
        this.setState({ allowedFigures: newAllowedFigures, active: newAllowedFigures[activeFigureIndex] });
    }

    _moveDown = () => {
        const { activeFigureIndex, allowedFigures, bottomStructure } = this.state;
        const { incativeBottom } = DefaultStates;
        let newAllowedFigures = [...allowedFigures];
        newAllowedFigures = newAllowedFigures.map((item) => item.map((figure) => figure + 10));
        if (_.intersection(newAllowedFigures[activeFigureIndex], incativeBottom).length > 0 ||
            _.intersection(newAllowedFigures[activeFigureIndex], bottomStructure).length > 0) {
            let newBottomStructure = [...bottomStructure];
            newBottomStructure.push(newAllowedFigures[activeFigureIndex].map((figure) => figure - 10));
            this.setState({ bottomStructure: _.uniq(newBottomStructure.flat()) });
            this._changeFigure();
            this._checkProgress();
            return false;
        }
        this.setState({
            allowedFigures: newAllowedFigures,
            active: newAllowedFigures[activeFigureIndex]
        });
    }

    _rotateFigure = () => {
        const { activeFigureIndex, allowedFigures, bottomStructure } = this.state;
        const { incativeBottom, incatives } = DefaultStates;
        const maxIndex = allowedFigures.length - 1;
        const newIndex = activeFigureIndex + 1 <= maxIndex ? activeFigureIndex + 1 : 0;
        if (
            _.intersection(allowedFigures[newIndex], incatives.concat(incativeBottom)).length > 0 ||
            _.intersection(allowedFigures[newIndex], bottomStructure).length > 0
        ) {
            return false;
        }
        this.setState({ activeFigureIndex: newIndex, active: allowedFigures[newIndex] });
    }

    _changeFigure = () => {
        const { allowedFiguresDefault } = DefaultStates;
        const currentFigure = Math.floor(Math.random() * allowedFiguresDefault.length);
        let newAllowedFigures = allowedFiguresDefault[currentFigure];
        this.setState({
            activeFigureIndex: 0,
            allowedFigures: newAllowedFigures,
            active: newAllowedFigures[0]
        });
    }

    _checkLine = () => {
        const { filledLineMarker, bottomStructure } = this.state;
        if (!bottomStructure.length) { return false; }

        let newBottomStructure = [...bottomStructure];
        filledLineMarker.map((item) => {
            if (item.every((elem) => newBottomStructure.includes(elem))) {
                let newBottomStructureFiltered = [...newBottomStructure.filter((el) => !item.includes(el))];
                newBottomStructureFiltered = newBottomStructureFiltered.map((block) => {
                    if (block < Math.min(...item)) {
                        block = block + 10;
                    }
                    return block;
                });
                this.setState({ bottomStructure: newBottomStructureFiltered });
                this.setState({ score: this.state.score + 1 });
            }
        });
    }

    _checkProgress = () => {
        const { filledLineMarker, bottomStructure } = this.state;
        const firstLine = filledLineMarker[0];
        if (_.intersection(bottomStructure, firstLine).length) {
            this.setState({ canPlay: false });
            this._destractGame();
            const answer = prompt('GAME over bro. Do you want play again?', 'Yes');
            if (answer && answer.toLocaleLowerCase() === 'yes') {
                this._restartGame();
            } else {
                this.setState({ showScore: true });
            }
        }
    }

    _keyBoardEvent = (e) => {
        switch (e.code) {
        case 'ArrowRight':
            this._moveRight();
            break;
        case 'ArrowLeft':
            this._moveLeft();
            break;
        case 'ArrowDown':
            this._moveDown();
            break;
        case 'ArrowUp':
            this._rotateFigure();
            break;
        }
    }

    render () {
        const {
            bottomStructure,
            active,
            showScore,
            score
        } = this.state;
        const { fieldHeight, fieldWidth, incatives, incativeBottom } = DefaultStates;
        let field = [];
        for (let i = 0; i < fieldHeight; i++) {
            let line = [];
            for (let j = 0; j < fieldWidth; j++) {
                const number = Number(String(i) + j);
                const incative = incatives.includes(number) || incativeBottom.includes(number);
                line.push(<Block
                    key={j}
                    incative={incative}
                    index={j}
                    active={active.includes(number) || bottomStructure.includes(number)}
                    number={number} ></Block>);
            }
            field.push(<Line key={i} line={line} index={i}></Line>);
        }

        return (
            <div>
                <div>Score: {score}</div>
                { !showScore && <div
                    className={styles.field}
                >
                    {field}
                </div> }
                {showScore && <button onClick={this._restartGame}>Play again</button>}
            </div>
        );
    }
}

export default Index;
