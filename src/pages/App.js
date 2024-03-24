"use client";

import * as tf from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [model, setModel] = useState(null);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({ human: 0, computer: 0 });
  const [isTraining, setIsTraining] = useState(false);
  const [vectorLength, setVectorLength] = useState(0);

  const vector_len = () => {
    // return Math.floor(Math.log2(history.length + 1));
    return 3;
  };

  const handleClick = async (humanMove) => {
    const result = {
      round: history.length + 1,
      human: humanMove,
      computer: nextMove(),
    };
    updateScore(result.human, result.computer);
    await updateHistory(result);
  };

  const updateHistory = async (result) => {
    setHistory([...history, result]);
    if (history.length >= 4) trainModel();
  };

  const updateScore = (humanMove, computerMove) => {
    const rules = {
      0: 2, // rock beats scissors
      1: 0, // paper beats rock
      2: 1, // scissors beats paper
    };
    if (rules[humanMove] === computerMove) {
      setScore({ ...score, human: score.human + 1 });
    } else if (rules[computerMove] == humanMove) {
      setScore({ ...score, computer: score.computer + 1 });
    } else {
      return;
    }
  };

  const resetGame = () => {
    setHistory([]);
    setScore({ human: 0, computer: 0 });
  };

  const nextMove = () => {
    const vec_len = vectorLength;
    if (history.length < 8) return Math.floor(Math.random() * 3);
    else {
      const inputs = tf.tensor2d([
        history.slice(-vec_len).flatMap((h) => [h.human, h.computer]),
      ]);
      const prediction = model.predict(inputs);
      if (prediction.max().dataSync()[0] < 0.75) {
        return Math.floor(Math.random() * 3);
      }
      const humanMove = prediction.argMax(-1).dataSync()[0];
      const computerMove = (humanMove + 1) % 3;
      return computerMove;
    }
  };

  const trainModel = async () => {
    setIsTraining(true);
    const vec_len = vector_len();
    setVectorLength(vec_len);
    // const units = 8 + history.length / 4;
    // cast to integer
    const units = parseInt(6 + history.length / 4);
    const model_new = tf.sequential();
    model_new.add(
      tf.layers.dense({
        units: units,
        inputShape: [vec_len * 2],
        activation: "relu",
      })
    );
    model_new.add(tf.layers.dense({ units: 3, activation: "softmax" }));
    const compileArgs = {
      optimizer: tf.train.adam(),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    };
    model_new.compile(compileArgs);

    const inputs = history
      .slice(0, -1)
      .map((_, i, arr) => arr.slice(i, i + vec_len))
      .filter((group) => group.length === vec_len)
      .map((group) => group.flatMap((h) => [h.human, h.computer]))
      .slice(-200);
    const targets = tf
      .oneHot(
        history.slice(vec_len).map((h) => h.human),
        3
      )
      .arraySync()
      .slice(-200);
    if (inputs.length > 8) {
      const xs = tf.tensor2d(inputs, [inputs.length, vec_len * 2]);
      const ys = tf.tensor2d(targets, [targets.length, 3]);
      await model_new.fit(xs, ys, { epochs: 10 });
    }
    setModel(model_new);
    setIsTraining(false);
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
            {isTraining && (
              <span className="font-semibold text-base">Loading ... </span>
            )}
          </div>
          <Button size="sm" onClick={resetGame}>
            Reset
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button
            disabled={isTraining}
            className="col-span-1"
            size="lg"
            onClick={() => handleClick(0)}
          >
            Rock
          </Button>
          <Button
            disabled={isTraining}
            className="col-span-1"
            size="lg"
            onClick={() => handleClick(1)}
          >
            Paper
          </Button>
          <Button
            disabled={isTraining}
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
      </div>
    </div>
  );
}
