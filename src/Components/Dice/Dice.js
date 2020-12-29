import React from 'react';
import './Dice.scss';
import Dot from './Dot/Dot';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dice = () => {
    
    const [computerVal, setComputerVal] = useState(null)
    let [val, setVal] = useState(null);
    let [points, setPoints] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [information, setInformation] = useState('');
    const [stopped, setStopped] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://roll.diceapi.com/json/d6');
            setComputerVal(response.data.dice[0].value);
            setVal(Math.floor(Math.random() * 6) + 1);
            // var random = 1;
            // var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            // random = random * plusOrMinus; 
            // var currentnumber = response.data.dice[0].value;
            // if(currentnumber == 6) {
            //     currentnumber = 5;
            // } 
            // if(currentnumber == 1) {
            //     currentnumber = 2;
            // }
            // setVal(currentnumber + random);
        }
        fetchData();
    }, [])

    const stopGame = () => {
        setStopped(true);
    }

    const compareNumbers = () => {
        if (val < computerVal) {
            setInformation('Go higher!')
        } else if (val > computerVal) {
            setInformation('Go lower!')
        } else {
            setInformation('Great!');
            setPoints(points += 0.1);
            stopGame();
        }
    }

    const playNextRound = async () => {
        setStopped(false);
        let newValue = Math.floor(Math.random() * 6) + 1;
        setVal(newValue);
        const response = await axios.get('http://roll.diceapi.com/json/d6');
        const compValue = response.data.dice[0].value;
        setComputerVal(compValue);
        if (newValue < compValue) {
            setInformation('Go higher!')
        } else if (newValue > compValue) {
            setInformation('Go lower!')
        } else {
            setInformation('Great!');
            setPoints(points += 0.1);
            stopGame();
        }
    }

    const playGame = () => {
        setIsStarted(true);
        compareNumbers();
        console.log('computer from play game', computerVal);
        console.log('player from play game', val);
    }

    const getHigherValue = () => {
        if(val < 6) {
            setVal(val += 1);
        }

        compareNumbers();
    }

    const getLowerValue = () => {
        if(val > 1) {
            setVal(val -= 1);
        }

        compareNumbers();
    }


    let structure = <div className="starting-dice">
    </div>;

    if (val === 1) {
        structure = <div className="dice one">
                        <Dot />
                    </div>
    } else if (val === 2) {
        structure = <div className="dice two">
                        <Dot />
                        <Dot style="second-dot"/>
                    </div>
    } else if (val === 3) {
        structure = <div className="dice two">
                        <Dot />
                        <Dot style="second-dot-with-third"/>
                        <Dot style="third-dot" />
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
                    <button className="playBtn" onClick={playGame}>Play Game!</button>
                </div> : 
            <div className="container">
                <p className="info">{information}</p>
                {structure}
                <p className="info">Number of points: {Math.round(points * 10) / 10}</p>
                {!stopped ? 
                    <div className="btns">
                        <button className="btn-higher" onClick={getHigherValue}>Roll higher</button>
                        <button className="btn-lower" onClick={getLowerValue}>Roll lower</button>
                    </div> : 
                        <button className="nextBtn" onClick={playNextRound}>Next round!</button>}
            </div>}                   
        </div>
    )
}

export default Dice;