import React from 'react';

import './Dice.scss';
import Dot from './Dot/Dot';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dice = () => {

    let [val, setVal] = useState(null);
    let [points, setPoints] = useState(0);
    let [round, setRound] = useState(1);
    let [wonRounds, setWonRounds] = useState(0);
    let [lostRounds, setLostRounds] = useState(0);

    const [computerVal, setComputerVal] = useState(null)
    const [isStarted, setIsStarted] = useState(false);
    const [information, setInformation] = useState('');
    const [stopped, setStopped] = useState(false);
    const [statistics, setStatistics] = useState(false);
    const [history, setHistory] = useState([]);
    const [isSuspended, setIsSuspendend] = useState(false);

    const setDiceValues = async () => {
        const response = await axios.get('http://roll.diceapi.com/json/d6');
            let currentNumber = response.data.dice[0].value;
            let fixedNum = 1;
            const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            fixedNum = fixedNum * plusOrMinus; 

            let playerValue = currentNumber + fixedNum;

            if(playerValue === 6 || playerValue === 7) {
                playerValue = 5;
            }

            if(playerValue === 0 || playerValue === 1) {
                playerValue = 2;
            }

            setComputerVal(currentNumber);
            setVal(playerValue);
    }


    const onBeforeUnload = (obj) => {
        localStorage.setItem('suspendedGameObj', JSON.stringify(obj));
    }

    const storeSuspendedGame = () => {

        const pts = Math.round(points * 10) / 10;

        const suspendedGameObj = {
            numWonRounds: wonRounds,
            numLostRounds: lostRounds,
            numPoints: pts,
            numRound: round
        }

        if (round === 31) {
            localStorage.removeItem('suspendedGameObj');
        } else {
            window.onbeforeunload = onBeforeUnload(suspendedGameObj);
        }

    }


    useEffect(() => {
        const fetchData = () => {
            setDiceValues();
        }
        fetchData();

        const historyObject = JSON.parse(localStorage.getItem('historyGame'));
        const suspendedGameObject = JSON.parse(localStorage.getItem('suspendedGameObj'));

        if(historyObject !== null) {
            setHistory(historyObject);
        }

        if(suspendedGameObject !== null) {
            setIsSuspendend(true);
        }

    }, [])

    const restorePreviousGame = () => {

        const suspendedGameObject = JSON.parse(localStorage.getItem('suspendedGameObj'));

        setIsStarted(true);
        setInformation('Higher or lower?');
        setWonRounds(suspendedGameObject.numWonRounds);
        setLostRounds(suspendedGameObject.numLostRounds);
        setRound(suspendedGameObject.numRound);
        setPoints(suspendedGameObject.numPoints);
    }

    const stopGame = () => {
        setStopped(true);
    }
    
    const compareNumbers = () => {
        if(val === computerVal) {
            setInformation('You win!')
            setPoints(points += 0.1);
            stopGame();
            setRound(round += 1);
            setWonRounds(wonRounds += 1);
        } else {
            setInformation('You loose!')
            stopGame();
            setRound(round += 1);
            setLostRounds(lostRounds += 1);
        }
    }

    const finishGame = () => {
        if (round === 31) {
            setIsStarted(false);
            setStatistics(true);
            setRound(1);
            setPoints(0);
            setIsSuspendend(false);

            let entries = [...history];
            const pts = Math.round(points * 10) / 10;

            const entry = {
                roundsWon: wonRounds,
                roundsLost: lostRounds,
                numPoints: pts,
            }

            entries.push(entry);
            localStorage.setItem('historyGame', JSON.stringify(entries));
            const historyObject = JSON.parse(localStorage.getItem('historyGame'));
            setHistory(historyObject);
        }
    }

    const playNextRound = () => {
        setStopped(false);
        setInformation('Higher or lower?');
        setDiceValues();
    }

    const playGame = () => {
        setIsStarted(true);
        setInformation('Higher or lower?');
        setWonRounds(0);
        setLostRounds(0);
    }

    const getHigherValue = () => {
        if(val < 6) {
            setVal(val += 1);
        }
        compareNumbers();
        finishGame();

        storeSuspendedGame();
        
    }

    const getLowerValue = () => {
        if(val > 1) {
            setVal(val -= 1);
        }
        compareNumbers();
        finishGame();

        storeSuspendedGame();
    }


    let structure = null;

    if (val === 1) {
        structure = <div className="dice one">
                        <Dot />
                    </div>
    } else if (val === 2) {
        structure = <div className="dice two">
                        <Dot />
                        <Dot dotStyle="second-dot"/>
                    </div>
    } else if (val === 3) {
        structure = <div className="dice two">
                        <Dot />
                        <Dot dotStyle="second-dot-with-third"/>
                        <Dot dotStyle="third-dot" />
                    </div>
    } else if (val === 4) {
        structure = <div className="dice four">
                        <div className="col">
                            <Dot />
                            <Dot />
                        </div>
                        <div className="col">
                            <Dot />
                            <Dot />
                        </div>
                    </div>

    } else if (val === 5) {
        structure = <div className="dice five">
                        <div className="col">
                            <Dot />
                            <Dot />
                        </div>
                        <div className="second-col">
                            <Dot />
                        </div>
                        <div className="col">
                            <Dot />
                            <Dot />
                        </div>
                    </div>
    } else if (val === 6) {
       structure = <div className="dice four">
                        <div className="col">
                            <Dot />
                            <Dot />
                            <Dot />
                        </div>
                        <div className="col">
                            <Dot />
                            <Dot />
                            <Dot />
                        </div>
                     </div>
    }

    return(
        <div className="container">
            {!isStarted ? 
                <div>
                    {statistics ? 
                    <div className="inner-container">
                        <div className="stats-container">
                            <p className="title">Details of your current game</p>
                            <div>
                                <p className="stats">Rounds won: {wonRounds}</p>
                                <p className="stats">Rounds lost: {lostRounds}</p>
                            </div>
                        </div>
                        <div className="history-container">
                            <p className="title">Details of your past games</p>
                            {history.map(el => {
                                return (
                                    <div>
                                        <p className="stats">Rounds won: {el.roundsWon}</p>
                                        <p className="stats">Rounds lost: {el.roundsLost}</p>
                                        <p className="stats">Number of points: {el.numPoints}</p>
                                        <hr/>
                                    </div>
                                )
                            })}
                        </div>
                    </div> : 
                    null}

                    {!isSuspended ? <button className="playBtn" onClick={playGame}>Play Game!</button> : 
                    <div>
                        <p className="title">Reload the previous game?</p>
                        <div className="suspended-container">
                            <button className="playBtn" onClick={restorePreviousGame}>Yes</button>
                            <button className="playBtn" onClick={playGame}>No</button>
                        </div>
                    </div>
                    }
                </div> : 
            <div className="container">
                <p className="info">{information}</p>
                {structure}
                <p className="info">Number of points: {Math.round(points * 10) / 10}</p>
                {!stopped ? 
                    <div className="btns">
                        <button className="btn-higher" onClick={getHigherValue}>Roll higher</button>
                        <button className="btn-lower" onClick={getLowerValue}>Roll lower</button>
                        <p className="counter">Round: {round}/30</p>
                    </div> : 
                        <button className="nextBtn" onClick={playNextRound}>Next round!</button>}
            </div>}                   
        </div>
    )
}

export default Dice;