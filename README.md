# Rock, Paper, Scissors - Meta-Strategy Bot

[Vercel webapp](https://rock-paper-scissors-webapp.vercel.app) | [Github repo](https://github.com/detrin/rock-paper-scissors-webapp)

This project presents an implementation of a web-based game of Rock, Paper, Scissors against an advanced AI bot powered by **meta-strategy** techniques inspired by legendary bots like **Iocaine Powder** (Dan Egnor) and **Greenberg** (Andrzej Nagorko).

## Description

Using `React` for building the web interface and a sophisticated meta-strategy system for the game logic, we built an interactive game that exploits human psychological patterns and adapts in real-time to beat human players.

### The Meta-Strategy Architecture

The bot uses a technique called **Meta-Strategy** where every predictor has multiple "shadow" predictors that think at different levels:

- **P.0 (Naive)**: The predictor says "Opponent will play Rock" → I play Paper
- **P.1 (Second-Guessing)**: The opponent expects me to play Paper, so they will play Scissors → I play Rock to beat their Scissors
- **P.2 (Triple-Guessing)**: The opponent expects me to play Rock, so they will play Paper → I play Scissors

This multi-layered approach allows the bot to adapt to players who try to outthink it, automatically detecting and countering their level of strategic thinking.

### The Strategies (The "Brains")

The bot employs multiple strategies that target human psychological weaknesses:

#### 1. **Frequency Analysis** (Gambler's Fallacy Exploit)
Humans often feel that if they haven't played a move in a while, it's "due." The bot tracks move frequencies and predicts the least common move, exploiting this cognitive bias.

#### 2. **Pattern Matching** (History Trees)
Humans fall into rhythmic loops like Rock → Paper → Scissors → Rock. The bot searches for repeating sequences in the move history and predicts based on what followed similar patterns in the past.

#### 3. **Win-Stay, Lose-Shift Exploiter**
This is the #1 psychological weakness in casual players:
- If a human wins with Rock, they often unconsciously play Rock again (feeling "lucky")
- If they lose with Rock, they almost always switch

The bot exploits this by predicting repeat moves after wins and switches after losses.

#### 4. **Double-Run Detection**
If a human plays the same move twice (e.g., Rock, Rock), they are highly unlikely to play it a third time (they feel it's "too predictable"). The bot detects this pattern and adjusts accordingly.

#### 5. **The Opener**
Inexperienced players overwhelmingly start with Rock (perceived as "strong"). The bot always starts the first round with Paper to exploit this tendency.

### Strategy Selection (The Meta-AI)

The bot uses a **virtual scoring system**:

1. **Tracking**: On every turn, ALL strategies make predictions (but don't output them)
2. **Scoring**: If a strategy would have won, it gets +1 point. If it would have lost, it gets -1 point
3. **Selection**: The bot picks the strategy with the highest score over recent turns
4. **Decay**: Scores decay slightly (×0.95) each turn, prioritizing recent performance

This allows the bot to automatically discover which strategy works best against each individual player and adapt in real-time.

## Technical Implementation

The bot is implemented as a JavaScript class (`RPSBot`) that:

- Maintains move history and results
- Tracks performance scores for each strategy's shadow predictors
- Generates predictions from all strategies simultaneously
- Selects the best-performing strategy/shadow combination
- Updates scores after each round to improve future predictions

The React frontend integrates seamlessly with the bot, providing a clean UI for gameplay and history tracking.

## Usage

To play the game:

1. Make your move by clicking either 'Rock', 'Paper', or 'Scissors'
2. The bot will respond based on its meta-strategy analysis
3. Scores are updated automatically
4. A history of all rounds is maintained in the table below
5. You can reset the game at any point with the 'Reset' button

**Pro Tip**: The bot learns from your playing patterns. Try different strategies and see how it adapts! The more you play, the better it gets at predicting your moves.

## Why This Approach Works

Humans are terrible at being random. We fall into predictable patterns, cognitive biases, and psychological tells. This bot exploits:

- **Gambler's Fallacy**: Thinking rare moves are "due"
- **Pattern Repetition**: Falling into rhythmic loops
- **Win-Stay, Lose-Shift**: Repeating winning moves, switching after losses
- **Predictability Anxiety**: Avoiding moves that seem "too obvious"
- **Opening Tendencies**: Starting with "strong" moves like Rock

By combining multiple strategies with meta-level thinking, the bot can adapt to almost any human playing style and maintain a significant advantage.

---

Made by [Daniel Herman](https://www.hermandaniel.com)
