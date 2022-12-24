// NAVIGATION
function navToGame() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
  reset();
}

function start(mode) {
  globals.gameMode = mode;
  if (mode === "minimax") {
    navToGame();
    hideButtons(["q-table-training-area"]);
  } else if (mode === "q-table") {
    showButtons(["q-table-training-area"]);
    navToGame();
  }
}

document.addEventListener('keydown', function(event) {
  if(event.key === "q") { // q
      start('q-table');
  }
  else if(event.key === "m") { // m
      start("minimax")
  }
});

// GLOBALS
let globals = {
  gameMode: "minimax"
};

let gameData = {
  gameBoard: "000000000", //The Board is Col-Row
  currentPlayer: 1,
  winner: null
}

// UI FUNCTIONS
function reset() {
  gameData.gameBoard = "000000000";
  gameData.currentPlayer = 1;
  gameData.winner = null;
  updateViewToGameBoard();
}
function playO() {
  reset();
  makeAIMove();
}
function playX() {
  reset();
  document.getElementById("thinking").innerHTML = "Your Move";
}
function updateView(board, player) {
  for (let i=0;i<board.length;i++) {
    document.getElementById("id"+i).innerHTML = (board[i]==0?"":(board[i]==1?"X":"O"));
  }
  document.getElementById("nextTurn").innerHTML = "Next Player: "+ (player==1?"X":"O");
}
function updateViewToGameBoard() {
  updateView(gameData.gameBoard, gameData.currentPlayer);

  gameData.winner = checkForWin(gameData.gameBoard);
  if (gameData.winner) {
    document.getElementById("nextTurn").innerHTML = gameData.winner==1?"Winner: X":(gameData.winner == 2? "Winner: O": "Tie Game!");
    document.getElementById("thinking").innerHTML = "Game Over";
    return true;
  }
}
async function makeAIMove() {
  document.getElementById("thinking").innerHTML = "The AI is thinking...";

  if (globals.gameMode === "minimax") {
    console.log("Making AI Move by Minimax");
    setTimeout(async function() {
      let action = await getActionByMinimax(gameData.currentPlayer, gameData.gameBoard);
      document.getElementById("thinking").innerHTML = "Your Move";
      gameData.gameBoard = placeInSquare(gameData.gameBoard, action, gameData.currentPlayer);
      gameData.currentPlayer = gameData.currentPlayer % 2 + 1;
      updateViewToGameBoard();
    }, 200);
  } else if (globals.gameMode === "q-table") {
    console.log("Making AI Move by Q-table");
    setTimeout(async function() {
      let action = await qLearner.getAction(gameData.gameBoard, getAllowedMoves(gameData.gameBoard));
      console.log("Selected Action: "+action)
      document.getElementById("thinking").innerHTML = "Your Move";
      gameData.gameBoard = placeInSquare(gameData.gameBoard, action, gameData.currentPlayer);
      gameData.currentPlayer = gameData.currentPlayer % 2 + 1;
      updateViewToGameBoard();
    }, 200);
  }
}
async function squareClicked(square) {
  if (squareFull(gameData.gameBoard, square) || gameData.winner) {return;}
  gameData.gameBoard = placeInSquare(gameData.gameBoard, square, gameData.currentPlayer);
  gameData.currentPlayer = gameData.currentPlayer % 2 + 1;
  updateViewToGameBoard();
  
  // AI's Turn if game not over
  if (gameData.winner == null) {
    makeAIMove();
  }
}

function showButtons(buttons) {
  for(let buttonId of buttons) {
    document.getElementById(buttonId).classList.remove("hidden");
  }
}
function hideButtons(buttons) {
  for(let buttonId of buttons) {
    document.getElementById(buttonId).classList.add("hidden");
  }
}

// GAME FUNCTIONS
function placeInSquare(board, square, player) {
  return board.substr(0, square) + (player==0?"0":(player==1?"1":"2")) + board.substr(square+1);
}
function boardFull(board) {
  for (let i=0;i<board.length;i++) {
    if (board[i] == "0") {
      return false;
    }
  }
  return true;
}
function squareFull(board, square) {
  if (board[square] == "0") {
    return false;
  }
  return true;
}
function checkForWin(board) {
  // 8 lines
  if (board[0] != "0" && board[0] == board[1] && board[0] == board[2]) { return board[0] };
  if (board[3] != "0" && board[3] == board[4] && board[3] == board[5]) { return board[3] };
  if (board[6] != "0" && board[6] == board[7] && board[6] == board[8]) { return board[6] };
  if (board[0] != "0" && board[0] == board[3] && board[0] == board[6]) { return board[0] };
  if (board[1] != "0" && board[1] == board[4] && board[1] == board[7]) { return board[1] };
  if (board[2] != "0" && board[2] == board[5] && board[2] == board[8]) { return board[2] };
  if (board[0] != "0" && board[0] == board[4] && board[0] == board[8]) { return board[0] };
  if (board[6] != "0" && board[6] == board[4] && board[6] == board[2]) { return board[6] };

  if (boardFull(board)) {
    return 3;
  }

  return null;
}
function getAllowedMoves(board) {
  let allowedActions = [];
  for (let square=0;square<9;square++) {
    if (!squareFull(board, square)) {
      allowedActions.push(square);
    }
  }
  return allowedActions;
}

//SYSTEM FUNCTIONS
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandInt(min, max) {
    let realMax = max+1;
    let random = (Math.floor(Math.random() * (realMax-min)) + min);
    return random;
}
function getIndexesOfMaxima(array) {
  let max = Math.max(...array);
  let indexes = [];
  for (i=0;i<array.length;i++) {
    if (array[i] == max) {
      indexes.push(i);
    }
  }
  return indexes;
}


// MINIMAX FUNCTIONS
async function getActionByMinimax(player, board) {
  let results = [];
  let result;
  for (let square=0; square<9; square++) {
    if (squareFull(board, square)) { results.push(-100); continue; };
    result = await minimax(player, placeInSquare(board, square, player), 8, -Infinity, Infinity, false);
    results.push(result);
  }
  let action = getRandomMax(results);
  return action;
}
function getScoreForPosition(board, winner, player, depthRemaining) {
  if (!winner) {
    winner = checkForWin(board);
  }

  if ((winner == 1 && player == 1) || (winner == 2 && player == 2)) {
    return 10 * depthRemaining/10;
  } else if ((winner == 1 && player == 2) || (winner == 2 && player == 1)) {
    return -10 * 1/(depthRemaining+1);
  } else if (winner == 3) {
    return 1 * depthRemaining/10 ;
  } else {
    return -1;
  }
}
async function minimax(player, position, depth, alpha, beta, maximizingPlayer) {
  let minEval, eval, maxEval;
  let winner = checkForWin(position);
  if (depth == 0 || winner != null) {
    return getScoreForPosition(position, winner, player, depth);
  }

  if (maximizingPlayer) {
    maxEval = -Infinity;
    for (let square=0; square<9; square++) {
      if (squareFull(position, square)) {
        continue;
      } else {
        temp = await minimax(player, placeInSquare(position, square, player), depth - 1, alpha, beta, false);
        eval = temp;
      }
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) {
        //break;
      }
    }
    return maxEval;
  } else {
    minEval = Infinity;
    for (let square=0; square<9; square++) {
      if (squareFull(position, square)) {
        continue;
      } else {
        temp = await minimax(player, placeInSquare(position, square, player%2+1), depth - 1, alpha, beta, true);
        eval = temp;
      }
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) {
        //break;
      }
    }
    return minEval;
  }
}
function getRandomMax(results) {
  let max = Math.max(...results);
  let maximaMoves = [];
  for (let i=0; i<results.length;i++) {
    if (results[i] == max) {
      maximaMoves.push(i);
    }
  }
  return maximaMoves[getRandInt(0, maximaMoves.length-1)];
}
async function testMinimax() {
  let results = [];
  let result;
  for (let square=0; square<9; square++) {
    if (squareFull(gameData.gameBoard, square)) { results.push(-100); continue; };
    result = await minimax(gameData.currentPlayer, placeInSquare(gameData.gameBoard, square, gameData.currentPlayer), 100, -Infinity, Infinity, false);
    results.push(result);
  }
  console.log(results);
  let action = getRandomMax(results);
  console.log("The best move is square: "+ action);
}


// QLEARNING FUNCTIONS
class TicTacToeQLearner {
  constructor(learningRate, discountFactor, startingExplortationRate, finalExplorationRate) {
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.startingExplortationRate = startingExplortationRate;
    this.explorationRate = startingExplortationRate;
    this.training = false;
    this.finalExplorationRate = finalExplorationRate;
    this.qTable = {};
    this.lastStateHash;
    this.lastAction;
    this.player = 1;
    this.verbose = false;
    this.statesInTable = 0;
  }

  adjustExplorationRate() {
    this.explorationRate = (this.explorationRate - this.finalExplorationRate) * 0.99 + this.finalExplorationRate;
  }

  setPlayer(player) {
    this.player = player;
  }

  addNewState(state) {
    this.qTable[state] = [0,0,0,0,0,0,0,0,0];
    this.statesInTable++;
  }

  getActionValuesFromStateAddIfNot(state) {
    if (state in this.qTable) {
      this.log("State: '"+state+"' Found!");
    } else {
      this.log("State: '"+state+"' not in table. Adding...");
      this.addNewState(state);
    }
    return this.qTable[state];
  }

  getActionValuesFromState(state) {
    let actionValues;
    if (state in this.qTable) {
      actionValues = this.qTable[state];
    } else {
      actionValues = [0,0,0,0,0,0,0,0,0];
    }
    return actionValues;
  }

  getAction(state, allowedActions) {
    this.log("Getting action from QLearner");
    let action;
    // Check if state exists
    let actionValues = this.getActionValuesFromStateAddIfNot(state);
    this.log("Action Values: "+ actionValues);
    // Explore vs Greedy
    if (Math.random() <= this.explorationRate && this.training) {
      // Random Action
      // Add state if non-existing
      
      action = allowedActions[Math.floor(Math.random() * allowedActions.length)];
      this.log("Random Action Selected: "+action);
      return action
    } else {
      // Best Action
      // TODO: Ensure the selected action is ALLOWED
      let action;
      for (let i=0;i<actionValues.length;i++) {
        if (!allowedActions.includes(i)) {
          actionValues[i] = -Infinity;
        }
      }
      let maxActions = getIndexesOfMaxima(actionValues);
      action = maxActions[getRandInt(0,maxActions.length-1)];
      this.log("Greedy Action Selected: "+action);
      return action;
    }
  }

  getQValue(state, action) {
    return this.qTable[state][action];
  }

  setQValue(state, action, value) {
    this.qTable[state][action] = value;
  }

  train(state, action, nextState) {
    //TRAIN
    let originalValue, newValue, reward;
    originalValue = this.getQValue(state, action);
    reward = this.getReward(nextState);
    // Q(s,a) <- Q(s, a) + lr[reward+discount*MAX(Q(s+1,a))-Q(s,a)]
    newValue = originalValue + this.learningRate * ( reward + this.discountFactor * Math.max(...this.getActionValuesFromState(nextState)) - originalValue );
    this.setQValue(state, action, newValue);

    this.log("Training");
    this.log("State: ");
    this.logState(state);
    this.log("Action: "+action);
    this.log("nextState: ");
    this.logState(nextState);
    this.log(`Original Value: ${originalValue}`);
    this.log(`Reward: ${reward}`);
    this.log(`New Value: ${newValue}`);
  }

  getReward(state) {
    let winner = checkForWin(state);
    if (winner == 1) {
      this.log("Winner: 1, Reward: "+(this.player == 1 ? 1000 : -1000));
      return this.player == 1 ? 1000 : -1000;
    } else if (winner == 2) {
      this.log("Winner: 2, Reward: "+(this.player == 2 ? 1000 : -1000));
      return this.player == 2 ? 1000 : -1000;
    } else if (winner == 3) {
      // Time or non-end state
      this.log("Winner: TIE, Reward: "+0);
      return 0;
    } else {
      // Non-ENd State
      this.log("Winner: NA, Reward: "+0);
      return 0;
    }
  }

  log(msg) {
    if (this.verbose) {console.log(msg)}
  }

  logState(state) {
    let str = "";
    for (let i=0; i<state.length; i++) {
      str += (state[i] == 0 ? "-" : (state[i] == 1 ? "X" : "O"));
      if (i == 2 || i == 5) {
        str += "\n";
      }
    }
    this.log(str);
  }
}

let qLearner = new TicTacToeQLearner(0.5, 0.95, 1, 0.01);

async function runTrain() {
  // TODO: Something to stop column clicks
  let times = document.getElementById("train-times").value;

  console.log(`Train called with times==${times}`);
  document.getElementById("thinking").innerHTML = "Training AI...";
  await sleep(1);
  let startTime = new Date();
  await train(times);
  let endTime = new Date();
  let timeDiff = endTime - startTime; //in ms
  document.getElementById("thinking").innerHTML = "Your Move";
  console.log(`Completed ${times} rounds of training in ${timeDiff/1000} seconds`);
  reset();
}

async function train(times) {
  let action;
  qLearner.training = true;
  qLearner.verbose = false;
  for (let i=0; i<times; i++) {
    qLearner.adjustExplorationRate();
    reset();
    qLearner.setPlayer(1);
    // Try starting, try going second
    if (i % 2 == 1) {
      qLearner.setPlayer(2);
      // Trainer Move
      action = await getActionByTrainer(gameData.currentPlayer, gameData.gameBoard);
      gameData.gameBoard = placeInSquare(gameData.gameBoard, action, gameData.currentPlayer);
      gameData.currentPlayer = gameData.currentPlayer % 2 + 1;
    } 
    // LOOP
    while (gameData.winner == null) {
      // Store Prev State
      let originalState = gameData.gameBoard;
      // QTable Move
      let originalAction = await qLearner.getAction(gameData.gameBoard, getAllowedMoves(gameData.gameBoard));
      //await sleep(1);
      gameData.gameBoard = placeInSquare(gameData.gameBoard, originalAction, gameData.currentPlayer);
      gameData.currentPlayer = gameData.currentPlayer % 2 + 1;

      gameData.winner = checkForWin(gameData.gameBoard);

      // Update QLearner
      if (gameData.winner != null) {
        qLearner.train(originalState, originalAction, gameData.gameBoard);
        break;
      }

      // Trainer Move
      let action = await getActionByTrainer(gameData.currentPlayer, gameData.gameBoard);
      gameData.gameBoard = placeInSquare(gameData.gameBoard, action, gameData.currentPlayer);
      gameData.currentPlayer = gameData.currentPlayer % 2 + 1;
      gameData.winner = checkForWin(gameData.gameBoard);

      qLearner.train(originalState, originalAction, gameData.gameBoard);
    }
  }
  qLearner.training = false;
  qLearner.verbose = true;
}

function showQTable() {
  console.log(qLearner.qTable);
}

async function getActionByTrainer(currentPlayer, board) {
  // 10% use minimax, 90% use random
  let trainingRate = 0.1;

  let action;
  if (Math.random() <= trainingRate) {
    action = await getActionByMinimax(currentPlayer, board);
  } else {
    let allowedActions = getAllowedMoves(board);
    action = allowedActions[Math.floor(Math.random() * allowedActions.length)];
  }
  return action;
}