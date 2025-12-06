"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">How It Works</h1>
          <Link href="/">
            <Button variant="outline">Back to Game</Button>
          </Link>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            This Rock, Paper, Scissors bot uses an advanced <strong>meta-strategy</strong> system 
            inspired by legendary bots like <strong>Iocaine Powder</strong> (Dan Egnor) and 
            <strong>Greenberg</strong> (Andrzej Nagorko). It exploits human psychological patterns 
            and adapts in real-time to beat human players.
          </p>
        </section>

        {/* Video: Origin of Iocaine Powder */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The Origin: Meta-Strategy & Iocaine Powder</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The most famous meta-strategy for computer Rock Paper Scissors is <strong>Iocaine Powder</strong>, 
            named after the iconic scene in <em>The Princess Bride</em>, with its endless battle of wits. 
            The basic insight is that any successful prediction (P) for your opponent's strategy can run 
            at multiple meta-levels, creating shadow predictors that think at different depths.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/rMz7JBRbmNo"
                title="The Origin of Meta-Strategy: Iocaine Powder"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This video explains how Iocaine Powder introduced the concept of meta-level thinking, 
            where each predictor can operate at multiple levels (P.0, P.1, P.2) to counter opponents 
            who try to outthink the strategy.
          </p>
        </section>

        {/* Meta-Strategy Architecture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The Meta-Strategy Architecture</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The bot uses a technique called <strong>Meta-Strategy</strong> where every predictor 
            has multiple "shadow" predictors that think at different levels:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>
              <strong>P.0 (Naive)</strong>: The predictor says "Opponent will play Rock" → I play Paper
            </li>
            <li>
              <strong>P.1 (Second-Guessing)</strong>: The opponent expects me to play Paper, so they 
              will play Scissors → I play Rock to beat their Scissors
            </li>
            <li>
              <strong>P.2 (Triple-Guessing)</strong>: The opponent expects me to play Rock, so they 
              will play Paper → I play Scissors
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            This multi-layered approach allows the bot to adapt to players who try to outthink it, 
            automatically detecting and countering their level of strategic thinking.
          </p>
        </section>

        {/* Strategies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The Strategies</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The bot employs multiple strategies that target human psychological weaknesses:
          </p>

          <div className="space-y-6">
            {/* Strategy 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">1. Frequency Analysis (Gambler's Fallacy Exploit)</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Humans often feel that if they haven't played a move in a while, it's "due." 
                The bot tracks move frequencies and predicts the least common move, exploiting 
                this cognitive bias.
              </p>
            </div>

            {/* Strategy 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">2. Pattern Matching (History Trees)</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Humans fall into rhythmic loops like Rock → Paper → Scissors → Rock. The bot 
                searches for repeating sequences in the move history and predicts based on what 
                followed similar patterns in the past.
              </p>
            </div>

            {/* Strategy 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">3. Win-Stay, Lose-Shift Exploiter</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This is the #1 psychological weakness in casual players:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4 mt-2">
                <li>If a human wins with Rock, they often unconsciously play Rock again (feeling "lucky")</li>
                <li>If they lose with Rock, they almost always switch</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                The bot exploits this by predicting repeat moves after wins and switches after losses.
              </p>
            </div>

            {/* Strategy 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">4. Double-Run Detection</h3>
              <p className="text-gray-700 dark:text-gray-300">
                If a human plays the same move twice (e.g., Rock, Rock), they are highly unlikely 
                to play it a third time (they feel it's "too predictable"). The bot detects this 
                pattern and adjusts accordingly.
              </p>
            </div>

            {/* Strategy 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">5. The Opener</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Inexperienced players overwhelmingly start with Rock (perceived as "strong"). 
                The bot always starts the first round with Paper to exploit this tendency.
              </p>
            </div>
          </div>
        </section>

        {/* Strategy Selection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Strategy Selection (The Meta-AI)</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The bot uses a <strong>virtual scoring system</strong>:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>
              <strong>Tracking</strong>: On every turn, ALL strategies make predictions (but don't output them)
            </li>
            <li>
              <strong>Scoring</strong>: If a strategy would have won, it gets +1 point. If it would have lost, it gets -1 point
            </li>
            <li>
              <strong>Selection</strong>: The bot picks the strategy with the highest score over recent turns
            </li>
            <li>
              <strong>Decay</strong>: Scores decay slightly (×0.95) each turn, prioritizing recent performance
            </li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300">
            This allows the bot to automatically discover which strategy works best against each 
            individual player and adapt in real-time.
          </p>
        </section>

        {/* Why It Works */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why This Approach Works</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Humans are terrible at being random. We fall into predictable patterns, cognitive biases, 
            and psychological tells. This bot exploits:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li><strong>Gambler's Fallacy</strong>: Thinking rare moves are "due"</li>
            <li><strong>Pattern Repetition</strong>: Falling into rhythmic loops</li>
            <li><strong>Win-Stay, Lose-Shift</strong>: Repeating winning moves, switching after losses</li>
            <li><strong>Predictability Anxiety</strong>: Avoiding moves that seem "too obvious"</li>
            <li><strong>Opening Tendencies</strong>: Starting with "strong" moves like Rock</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            By combining multiple strategies with meta-level thinking, the bot can adapt to almost 
            any human playing style and maintain a significant advantage.
          </p>
        </section>

        {/* Sources */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Sources & References</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Egnor, Dan.</strong> "Iocaine Powder: A Meta-Strategy Algorithm." 
                <em>International RoShamBo Programming Competition</em>, 1999.
              </p>
              <a
                href="https://journals.sagepub.com/doi/abs/10.3233/ICG-2000-23105?download=true"
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                https://journals.sagepub.com/doi/abs/10.3233/ICG-2000-23105
              </a>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Linch.</strong> "Rock Paper Scissors is Not Solved, In Practice." 
                <em>The Inchpin</em>, Nov 29, 2025.
              </p>
              <a
                href="https://inchpin.substack.com/p/rock-paper-scissors-is-not-solved"
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                https://inchpin.substack.com/p/rock-paper-scissors-is-not-solved
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button>Play Now</Button>
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                Made by{" "}
                <a
                  href="https://www.hermandaniel.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Daniel Herman
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

