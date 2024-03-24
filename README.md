# Rock, Paper, Scissors with TensorFlow.js

[Vercel webapp](https://rock-paper-scissors-webapp-r5up.vercel.app) | [Github repo](https://github.com/detrin/rock-paper-scissors-webapp)

This project presents an implementation of a web-based game of Rock, Paper, Scissors against the computer powered by `TensorFlow.js`; a library for machine learning in JavaScript. 

## Description

Using `React` for building the web interface and TensorFlow.js for crafting the game logic, we built an interactive game that makes use of Tensorflow's machine learning capabilities to train a model for the computer's moves.

### Neural Network

In essence, the computer analyzes the human player's past moves and trains itself to predict the next move. Specifically, the network we used is a simple sequential model in TensorFlow.js. 

The sequential model is a linear stack of layers that we can create using `tf.sequential()`. For this project:

1. We defined a `Dense` layer taking in the `vector_len` (set to 4 past moves, implying dim=8) which incorporates human and computer past moves as the input shape. We used `ReLU` (Rectified Linear Unit) as the activation function for this layer, which provides the non-linearity needed for the model.

2. Next, another `Dense` layer has been incorporated. Here, we indicated three units (corresponding to rock, paper, and scissors) and employed the `Softmax` activation function to assign probabilistic outputs to each class.

3. For compiling the model, we employed the `Adam` optimizer and the `categoricalCrossentropy` loss function as they typically render good results for multiclass classification tasks such as this. The model's performance is measured using `accuracy`. When below 0.75 accuracy random move is selected.

The model is then trained on a series of past moves with various configurations to improve its prediction capabilities.


## Usage

To play the game, just make your move by clicking either 'Rock', 'Paper' or 'Scissors'. The scores are updated and a history of all rounds is maintained. You can also reset the game at any point with the 'Reset' button.

So, keep playing and enjoy a round of Rock, Paper, Scissors!