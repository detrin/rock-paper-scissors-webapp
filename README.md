# Rock-Paper-Scissors Webapp Using Multi-Armed Bandit Strategy
This project is a simple, engaging web-based game of Rock-Paper-Scissors.

[Vercel webapp](https://rock-paper-scissors-webapp-r5up.vercel.app) | [Github repo](https://github.com/detrin/rock-paper-scissors-webapp)

## Multi-Armed Bandit
In probability theory, the problem of the Multi-Armed Bandit involves a gambler who decides which arms to pull on a slot machine with several levers, each providing a distinct and unknown reward distribution. The ultimate goal is to determine a strategy that optimizes pulling the levers to produce the greatest total benefit.

In the context of our Rock-Paper-Scissors game, the different "arms" or choices are "rock", "paper", and "scissors". The application utilizes this strategy to decide the next move of the computer.

## Decision Algorithm
The decision-making process is grounded in the Multi-Armed Bandit strategy. It performs in two steps:

1. If a random number generated between 0 (inclusive) and 1 (exclusive) is less than epsilon (i.e., within our 20% band), the computer makes a randomized decision, not based on any previous history or learned behavior, to facilitate exploration.
2. Alternatively, when the random number surpasses epsilon, the algorithm proceeds to choose the option with the highest estimated reward, reinforcing what we've learned and established as the best choice from experience so far.

## Updating the Bandits
In each round, the updateBandits function adjusts the 'bandits' scores based on the game's outcome:

- If the result of the round is "You win!", the 'bandits' failure count corresponding to the used move is increased by one.
- On the contrary, if the result is "You lose!", the 'bandits' score corresponding to the used move is increased by one.