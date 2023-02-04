import React from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
localStorage.setItem("best", 100000);
export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);
  React.useEffect(() => {
    const val = dice[0].value;
    // console.log("effeft ran");
    // setRolls((prevrolls) => prevrolls + 1);
    const allSame = dice.every((die) => die.value === val);
    const allHeld = dice.every((die) => die.isHeld === true);
    console.log(rolls);
    if (allSame && allHeld) {
      setTenzies(true);
      if (rolls < localStorage.getItem("best")) {
        console.log("Success", rolls);
        localStorage.setItem("best", rolls);
        // setRolls(0);
      }
    }
  }, [dice, rolls]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      const obj = {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      };
      newDice.push(obj);
    }
    return newDice;
  }
  function holdDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function rollDice() {
    setRolls((prev) => prev + 1);
    if (!tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld === true
            ? die
            : {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid(),
              };
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
    }
  }

  const diceElements = dice.map((die) => (
    <Die
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      key={die.id}
    ></Die>
  ));

  return (
    <main>
      {tenzies && <Confetti width={"800px"} height={"400px"} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="dice-roll" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      {tenzies && <p>It took you {rolls} rolls</p>}
      {tenzies && <p>Best time:{localStorage.getItem("best")}</p>}
    </main>
  );
}
