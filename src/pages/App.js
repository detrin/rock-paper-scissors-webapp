"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RPSBot from "@/lib/RPSBot";

export default function App() {
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({ human: 0, computer: 0 });
  const botRef = useRef(new RPSBot());
  const handleClickRef = useRef();

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

  // Keep the ref updated with the latest handleClick function
  handleClickRef.current = handleClick;

  const updateHistory = (result) => {
    setHistory((prevHistory) => [...prevHistory, result]);
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

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if user is typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "r") {
        handleClickRef.current(0); // Rock
      } else if (key === "p") {
        handleClickRef.current(1); // Paper
      } else if (key === "s") {
        handleClickRef.current(2); // Scissors
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Rock Paper Scissors</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Playing against <span className="font-semibold">Iocaine Shadow</span>
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Keyboard Shortcuts
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Press <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">R</kbd> for Rock,{" "}
                <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">P</kbd> for Paper, or{" "}
                <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">S</kbd> for Scissors
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-lg">Score</span>
            <span className="font-semibold text-2xl">{score.human}</span>
            <span className="font-semibold text-lg">-</span>
            <span className="font-semibold text-2xl">{score.computer}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/how-it-works">
              <Button size="sm" variant="outline">
                How does it work?
              </Button>
            </Link>
            <Button size="sm" onClick={resetGame}>
              Reset
            </Button>
          </div>
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
                <th className="w-1/4 px-4 py-2">Iocaine Shadow</th>
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
