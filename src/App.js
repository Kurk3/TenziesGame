import React, {useEffect, useState} from 'react';

import './style.css';
import Die from './components/Die.js';
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'


export default function App() {


    const [count, setCount] = React.useState(1);
    const [tenzies, setTenzies] = React.useState(false);
    const [dice, setDice] = React.useState(allNewDice());
    const [counter, setCounter] = React.useState(1);
    const [bestScore, setBestScore] = React.useState(localStorage.getItem('bestScore'));


    function trackRoll() {
        setCount(count + 1);
    }


    function holdDice(id) {
        setDice(dice.map(function (die) {
            return die.id === id ?
                {...die, isHeld: !die.isHeld}
                : die;
        }))
    }

    React.useEffect(() => {

        if (tenzies === false) {
            const allHeld = dice.every(die => die.isHeld)
            const firstValue = dice[0].value
            const allSameValue = dice.every(die => die.value === firstValue)

            if (!allHeld && !allSameValue) {
                counter > 0 && setTimeout(() => setCounter(counter + 1), 1000);
            }

        } else {
            // no longer running
        }

    },);


    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)

            if (counter < bestScore) {
                localStorage.setItem('bestScore', counter)
                setBestScore(localStorage.getItem('bestScore'))
                setBestScore(counter)
            }

            setCounter(1);
            // user won
        }
    }, [dice])


    const diceElements = dice.map(function (die, index) {
        return <Die isHeld={die.isHeld} key={die.id} value={die.value} holdDice={() => holdDice(die.id)}/>
    })


    function allNewDice() {

        const newDice = [];

        for (let i = 0; i < 10; i++) {
            newDice.push({
                value: Math.ceil(Math.random() * 6) + 1,
                isHeld: false,
                id: nanoid()
            })
        }
        return newDice;
    }


    function rollDice() {

        if (!tenzies) {
            trackRoll();
            setDice(dice.map(function (die) {
                return die.isHeld ?
                    die :

                    {
                        value: Math.ceil(Math.random() * 6) + 1,
                        isHeld: false,
                        id: nanoid()
                    }
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(1)
        }
    }


    return (
        <div className="content-wrapper">

            <main>
                <h1>Tenzies</h1>
                <div className="dice-container">
                    {diceElements}
                </div>

                <button className="roll-dice" onClick={rollDice}>
                    {tenzies ? "New Game" : "Roll"}
                </button>
                {tenzies === true && <Confetti/>}
                <h2>Rolls: {count}</h2>
                <div className="time-container">
                    <h2>Countdown: {counter}</h2>
                    <h2>Best time: {bestScore}</h2>
                </div>
            </main>
        </div>
    )
}
