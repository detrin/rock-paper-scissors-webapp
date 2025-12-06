/**
 * Advanced Rock-Paper-Scissors Bot
 * Based on Iocaine Powder and Greenberg meta-strategy approach
 * 
 * Implements multiple strategies with shadow predictors (P.0, P.1, P.2, P'.0, P'.1, P'.2)
 * and a meta-strategy selector that tracks performance.
 */

class RPSBot {
  constructor() {
    // History: stores opponent moves as 'R', 'P', 'S'
    this.history = "";
    // Our moves history
    this.ourMoves = "";
    // Results: 'W' (win), 'L' (loss), 'T' (tie)
    this.results = "";
    
    // Move mappings
    this.moves = ['R', 'P', 'S'];
    this.moveNames = { 'R': 'rock', 'P': 'paper', 'S': 'scissors' };
    this.moveIndices = { 'R': 0, 'P': 1, 'S': 2 };
    this.indexToMove = { 0: 'R', 1: 'P', 2: 'S' };
    
    // Winning relationships
    this.beats = { 'R': 'S', 'P': 'R', 'S': 'P' };
    this.beatenBy = { 'R': 'P', 'P': 'S', 'S': 'R' };
    
    // Strategy definitions
    // Each strategy has 3 shadow predictors: P.0 (Naive), P.1 (Second-guess), P.2 (Triple-guess)
    this.strategies = [
      { name: "Random", predict: () => this.strategyRandom() },
      { name: "Frequency", predict: () => this.strategyFrequency() },
      { name: "PatternMatch", predict: () => this.strategyPatternMatch() },
      { name: "WinStayLoseShift", predict: () => this.strategyWinStayLoseShift() },
      { name: "DoubleRun", predict: () => this.strategyDoubleRun() },
    ];
    
    // Track performance of each strategy's shadow predictors
    // Format: { strategyIndex: { shadowLevel: score } }
    // shadowLevel: 0 = P.0 (Naive), 1 = P.1 (Second-guess), 2 = P.2 (Triple-guess)
    // shadowLevel: 3 = P'.0 (Second-guess opponent), 4 = P'.1, 5 = P'.2
    this.strategyScores = {};
    this.initializeScores();
    
    // Track pending predictions for scoring
    this.pendingPredictions = null;
    
    // Track if this is the first move
    this.isFirstMove = true;
  }
  
  initializeScores() {
    for (let i = 0; i < this.strategies.length; i++) {
      this.strategyScores[i] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
  }
  
  /**
   * Main function: returns move index (0=rock, 1=paper, 2=scissors)
   */
  makeMove() {
    // The Opener: Always start with Paper (beats Rock, which inexperienced players often start with)
    if (this.isFirstMove) {
      this.isFirstMove = false;
      return 1; // Paper
    }
    
    // Not enough data? Play Random
    if (this.history.length < 3) {
      return this.getRandomMoveIndex();
    }
    
    // Generate predictions from all strategies with all shadow levels
    this.pendingPredictions = {};
    
    for (let strategyIndex = 0; strategyIndex < this.strategies.length; strategyIndex++) {
      const strategy = this.strategies[strategyIndex];
      
      // Get base prediction from strategy
      const basePrediction = strategy.predict();
      
      if (!basePrediction) continue;
      
      // Create shadow predictors
      // P.0 (Naive): Play move that beats the prediction
      const move0 = this.beatenBy[basePrediction];
      
      // P.1 (Second-guess): Opponent expects move0, so they play counter to move0
      // We play the counter to their counter
      const move1 = this.beatenBy[this.beatenBy[move0]];
      
      // P.2 (Triple-guess): Opponent expects move1, so they play counter to move1
      // We play the counter to their counter
      const move2 = this.beatenBy[this.beatenBy[move1]];
      
      // P'.0 (Second-guess the opponent): Assume opponent uses P against us
      // Predict what we would play (using P on our own moves), then predict what opponent
      // would play to beat that, then play the move that beats their move
      const ourPrediction = this.predictOurMove(strategy);
      if (ourPrediction) {
        // Opponent would play the move that beats what we're predicted to play
        const opponentCounter = this.beatenBy[ourPrediction];
        // We play the move that beats their counter
        const move3 = this.beatenBy[opponentCounter];
        
        // P'.1: Rotation of P'.0
        const move4 = this.beatenBy[this.beatenBy[move3]];
        
        // P'.2: Rotation of P'.1
        const move5 = this.beatenBy[this.beatenBy[move4]];
        
        this.pendingPredictions[strategyIndex] = {
          0: move0,
          1: move1,
          2: move2,
          3: move3,
          4: move4,
          5: move5
        };
      } else {
        // If we can't predict our own move, only use P.0, P.1, P.2
        this.pendingPredictions[strategyIndex] = {
          0: move0,
          1: move1,
          2: move2
        };
      }
    }
    
    // Select best strategy and shadow level
    const best = this.selectBestStrategy();
    
    if (best && this.pendingPredictions[best.strategyIndex]) {
      const selectedMove = this.pendingPredictions[best.strategyIndex][best.shadowLevel];
      return this.moveIndices[selectedMove];
    }
    
    // Fallback to random
    return this.getRandomMoveIndex();
  }
  
  /**
   * Select the strategy and shadow level with highest score
   */
  selectBestStrategy() {
    let bestScore = -Infinity;
    let bestStrategy = null;
    let bestShadow = 0;
    
    for (let strategyIndex = 0; strategyIndex < this.strategies.length; strategyIndex++) {
      for (let shadowLevel = 0; shadowLevel <= 5; shadowLevel++) {
        const score = this.strategyScores[strategyIndex][shadowLevel] || 0;
        if (score > bestScore) {
          bestScore = score;
          bestStrategy = strategyIndex;
          bestShadow = shadowLevel;
        }
      }
    }
    
    return bestStrategy !== null ? { strategyIndex: bestStrategy, shadowLevel: bestShadow } : null;
  }
  
  /**
   * Call this AFTER each round to update learning
   * @param {number} opponentMoveIndex - 0=rock, 1=paper, 2=scissors
   * @param {number} ourMoveIndex - 0=rock, 1=paper, 2=scissors
   */
  update(opponentMoveIndex, ourMoveIndex) {
    const opponentMove = this.indexToMove[opponentMoveIndex];
    const ourMove = this.indexToMove[ourMoveIndex];
    
    // Determine result
    let result = 'T'; // Tie
    if (this.beats[ourMove] === opponentMove) {
      result = 'W'; // We won
    } else if (this.beats[opponentMove] === ourMove) {
      result = 'L'; // We lost
    }
    
    // Update history
    this.history += opponentMove;
    this.ourMoves += ourMove;
    this.results += result;
    
    // Score all pending predictions
    if (this.pendingPredictions) {
      const winningMove = this.beatenBy[opponentMove];
      const losingMove = this.beats[opponentMove];
      
      for (let strategyIndex in this.pendingPredictions) {
        const predictions = this.pendingPredictions[strategyIndex];
        
        for (let shadowLevel in predictions) {
          const predictedMove = predictions[shadowLevel];
          if (!predictedMove) continue;
          
          let scoreChange = 0;
          
          if (predictedMove === winningMove) {
            scoreChange = 1; // Would have won
          } else if (predictedMove === losingMove) {
            scoreChange = -1; // Would have lost
          }
          // Tie = 0, no change
          
          // Update score with decay
          const currentScore = this.strategyScores[strategyIndex][shadowLevel] || 0;
          this.strategyScores[strategyIndex][shadowLevel] = currentScore * 0.95 + scoreChange;
        }
      }
    }
    
    // Clear pending predictions
    this.pendingPredictions = null;
  }
  
  // ========== STRATEGIES ==========
  
  /**
   * Helper: Predict what we would play using a strategy
   * This is used for P' variations - we apply the strategy to our own move history
   * by swapping perspectives (our moves become "opponent" moves from their perspective)
   */
  predictOurMove(strategy) {
    if (this.ourMoves.length < 2) return null;
    
    // Temporarily swap perspectives to predict our own moves
    const originalHistory = this.history;
    const originalOurMoves = this.ourMoves;
    const originalResults = this.results;
    
    // Swap: from opponent's perspective, our moves are their "opponent" moves
    this.history = this.ourMoves;
    // Swap results: if we won, from their perspective they lost (and vice versa)
    this.results = this.results.split('').map(r => {
      if (r === 'W') return 'L';
      if (r === 'L') return 'W';
      return 'T';
    }).join('');
    
    // Get prediction (what we would play from opponent's perspective)
    const prediction = strategy.predict();
    
    // Restore original state
    this.history = originalHistory;
    this.ourMoves = originalOurMoves;
    this.results = originalResults;
    
    return prediction;
  }
  
  /**
   * Strategy 1: Random
   */
  strategyRandom() {
    return this.moves[Math.floor(Math.random() * this.moves.length)];
  }
  
  /**
   * Strategy 2: Frequency Analysis
   * Predicts the move that beats the opponent's most common move
   * (Exploits "Gambler's Fallacy" - humans think rare moves are "due")
   */
  strategyFrequency() {
    if (this.history.length === 0) return null;
    
    const counts = { 'R': 0, 'P': 0, 'S': 0 };
    for (let move of this.history) {
      counts[move]++;
    }
    
    // Find least common move (humans often try to "balance")
    let leastCommon = 'R';
    let minCount = counts['R'];
    for (let move of this.moves) {
      if (counts[move] < minCount) {
        minCount = counts[move];
        leastCommon = move;
      }
    }
    
    // Predict they'll play the least common move to "balance"
    return leastCommon;
  }
  
  /**
   * Strategy 3: Pattern Matching (History Trees)
   * Looks for repeating patterns in history
   */
  strategyPatternMatch() {
    if (this.history.length < 2) return null;
    
    const maxPatternLength = Math.min(5, Math.floor(this.history.length / 2));
    
    // Try to find the longest matching sequence
    for (let n = maxPatternLength; n >= 1; n--) {
      const pattern = this.history.slice(-n);
      const searchSpace = this.history.slice(0, -1);
      const index = searchSpace.lastIndexOf(pattern);
      
      if (index !== -1) {
        // Found a match! What came AFTER that sequence?
        const nextChar = this.history[index + n];
        return nextChar;
      }
    }
    
    return null;
  }
  
  /**
   * Strategy 4: Win-Stay, Lose-Shift Exploiter
   * If opponent won last round, they'll likely repeat the same move
   * If opponent lost, they'll likely switch
   */
  strategyWinStayLoseShift() {
    if (this.results.length < 1) return null;
    
    const lastResult = this.results[this.results.length - 1];
    const lastOpponentMove = this.history[this.history.length - 1];
    
    if (lastResult === 'L') {
      // Opponent won - they'll likely repeat (Win-Stay)
      return lastOpponentMove;
    } else if (lastResult === 'W') {
      // Opponent lost - they'll likely switch (Lose-Shift)
      // Predict they'll switch to the move that would have beaten what we played
      const ourLastMove = this.ourMoves[this.ourMoves.length - 1];
      // They'll try to beat what we just played
      return this.beatenBy[ourLastMove];
    }
    
    // Tie - no strong signal
    return null;
  }
  
  /**
   * Strategy 5: Double-Run Detection
   * If opponent played the same move twice, they're unlikely to play it a third time
   */
  strategyDoubleRun() {
    if (this.history.length < 2) return null;
    
    const lastTwo = this.history.slice(-2);
    
    // Check if last two moves are the same
    if (lastTwo[0] === lastTwo[1]) {
      // They played the same move twice - unlikely to play it again
      // They'll likely play one of the other two moves
      // We play Scissors (beats Paper, ties Scissors) - safe move
      // Actually, let's predict they'll play the move that beats what they just played
      // (trying to counter our counter)
      const repeatedMove = lastTwo[0];
      // They might try to counter our counter, so predict the move that beats what beats their move
      return this.beatenBy[this.beatenBy[repeatedMove]];
    }
    
    return null;
  }
  
  /**
   * Helper: Get random move index
   */
  getRandomMoveIndex() {
    return Math.floor(Math.random() * 3);
  }
  
  /**
   * Reset bot state
   */
  reset() {
    this.history = "";
    this.ourMoves = "";
    this.results = "";
    this.initializeScores();
    this.pendingPredictions = null;
    this.isFirstMove = true;
  }
}

export default RPSBot;

