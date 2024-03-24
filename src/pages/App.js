"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function App() {
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({ human: 0, computer: 0 });
  const [bandits, setBandits] = useState({
    rock: { score: 0, failures: 0 },
    paper: { score: 0, failures: 0 },
    scissors: { score: 0, failures: 0 },
  });

  const handleClick = (humanMove) => {
    const computerMove = nextMove();
    updateScore(humanMove, computerMove);
    updateHistory(humanMove, computerMove);
    updateBandits(humanMove, computerMove);
  };

  const nextMove = () => {
    // Define your exploration factor
    let epsilon = 0.2;
    let max = -1;
    let maxBandit = null;

    if (Math.random() < epsilon) {
      // Make a random decision.
      const keys = Object.keys(bandits);
      maxBandit = keys[Math.floor(Math.random() * keys.length)];
    } else {
      // Make the best decision.
      for (let bandit in bandits) {
        let achievement_estimate = 0;

        // Ensure we don't divide by zero
        if (bandits[bandit].score !== 0 || bandits[bandit].failures !== 0) {
          achievement_estimate =
            bandits[bandit].score /
            (bandits[bandit].score + bandits[bandit].failures);
        }

        if (achievement_estimate > max) {
          max = achievement_estimate;
          maxBandit = bandit;
        }
      }
    }

    console.log(maxBandit);
    return maxBandit;
  };

  const updateBandits = (humanMove, computerMove) => {
    if (!bandits[computerMove]) return;

    let result = getResult(humanMove, computerMove);

    if (result === "You win!") {
      setBandits((prevBandits) => ({
        ...prevBandits,
        [computerMove]: {
          ...prevBandits[computerMove],
          failures: (prevBandits[computerMove]?.failures || 0) + 1,
        },
      }));
    } else if (result === "You lose!") {
      setBandits((prevBandits) => ({
        ...prevBandits,
        [computerMove]: {
          ...prevBandits[computerMove],
          score: (prevBandits[computerMove]?.score || 0) + 1,
        },
      }));
    }
  };

  const updateScore = (humanMove, computerMove) => {
    const rules = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };
    if (humanMove === computerMove) {
      return;
    }
    if (rules[humanMove] === computerMove) {
      setScore({ ...score, human: score.human + 1 });
    } else {
      setScore({ ...score, computer: score.computer + 1 });
    }
  };

  const updateHistory = (humanMove, computerMove) => {
    const result = {
      round: history.length + 1,
      human: humanMove,
      computer: computerMove,
      result: getResult(humanMove, computerMove),
    };
    setHistory([...history, result]);
  };

  const getResult = (humanMove, computerMove) => {
    if (humanMove === computerMove) {
      return "It's a tie!";
    }
    if (
      (humanMove === "rock" && computerMove === "scissors") ||
      (humanMove === "paper" && computerMove === "rock") ||
      (humanMove === "scissors" && computerMove === "paper")
    ) {
      return "You win!";
    }
    return "You lose!";
  };

  useEffect(() => {
    // Here you could load initial data if needed
  }, []);

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
          <Button
            size="sm"
            onClick={() => {
              setScore({ human: 0, computer: 0 });
              setHistory([]);
              setBandits({ rock: 1, paper: 1, scissors: 1 });
            }}
          >
            Reset
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button
            className="col-span-1"
            size="lg"
            onClick={() => handleClick("rock")}
          >
            Rock
          </Button>
          <Button
            className="col-span-1"
            size="lg"
            onClick={() => handleClick("paper")}
          >
            Paper
          </Button>
          <Button
            className="col-span-1"
            size="lg"
            onClick={() => handleClick("scissors")}
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
                .map((h, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{h.round}</td>
                    <td className="border px-4 py-2">{h.human}</td>
                    <td className="border px-4 py-2">{h.computer}</td>
                    <td className="border px-4 py-2">{h.result}</td>
                  </tr>
                ))
                .reverse()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
