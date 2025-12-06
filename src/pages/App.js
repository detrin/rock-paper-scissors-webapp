"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import RPSBot from "@/lib/RPSBot";

export default function App() {
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({ human: 0, computer: 0 });
  const botRef = useRef(new RPSBot());

  const handleClick = (humanMove) => {
    const computerMove = botRef.current.makeMove();
    const result = {
      round: history.length + 1,
      human: humanMove,
      computer: computerMove,
    };
    updateScore(result.human, result.computer);
    updateHistory(result);
    // Update bot learning after the round
    botRef.current.update(humanMove, computerMove);
  };

  const updateHistory = (result) => {
    setHistory([...history, result]);
  };

  const updateScore = (humanMove, computerMove) => {
    const rules = {
      0: 2, // rock beats scissors
      1: 0, // paper beats rock
      2: 1, // scissors beats paper
    };
    if (rules[humanMove] === computerMove) {
      setScore((prevScore) => ({ ...prevScore, human: prevScore.human + 1 }));
    } else if (rules[computerMove] == humanMove) {
      setScore((prevScore) => ({ ...prevScore, computer: prevScore.computer + 1 }));
    }
  };

  const resetGame = () => {
    setHistory([]);
    setScore({ human: 0, computer: 0 });
    botRef.current.reset();
  };

  const getResult = (humanMove, computerMove) => {
    if (
      (humanMove === "rock" && computerMove === "scissors") ||
      (humanMove === "paper" && computerMove === "rock") ||
      (humanMove === "scissors" && computerMove === "paper")
    ) {
      return "You win!";
    } else if (
      (computerMove === "rock" && humanMove === "scissors") ||
      (computerMove === "paper" && humanMove === "rock") ||
      (computerMove === "scissors" && humanMove === "paper")
    ) {
      return "You lose!";
    } else {
      return "It's a tie!";
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-lg">Score</span>
            <span className="font-semibold text-2xl">{score.human}</span>
            <span className="font-semibold text-lg">-</span>
            <span className="font-semibold text-2xl">{score.computer}</span>
          </div>
          <Button size="sm" onClick={resetGame}>
            Reset
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button
            className="col-span-1"
            size="lg"
            onClick={() => handleClick(0)}
          >
            Rock
          </Button>
          <Button
            className="col-span-1"
            size="lg"
            onClick={() => handleClick(1)}
          >
            Paper
          </Button>
          <Button
            className="col-span-1"
            size="lg"
            onClick={() => handleClick(2)}
          >
            Scissors
          </Button>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 w-full p-0">
          <table className="table-fixed w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/4 px-4 py-2">Round</th>
                <th className="w-1/4 px-4 py-2">Human</th>
                <th className="w-1/4 px-4 py-2">Computer</th>
                <th className="w-1/4 px-4 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {history
                .map((h, index) => {
                  const human = ["rock", "paper", "scissors"][h.human];
                  const computer = ["rock", "paper", "scissors"][h.computer];
                  const result = getResult(human, computer);
                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2">{h.round}</td>
                      <td className="border px-4 py-2">{human}</td>
                      <td className="border px-4 py-2">{computer}</td>
                      <td className="border px-4 py-2">{result}</td>
                    </tr>
                  );
                })
                .reverse()}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Made by{" "}
            <a
              href="https://www.hermandaniel.com"
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: "dodgerblue" }}
            >
              Daniel Herman
            </a>
          </p>
          <p>
            Check the code in this{" "}
            <a
              href="https://github.com/detrin/rock-paper-scissors-webapp"
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: "dodgerblue" }}
            >
              Github repo
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
