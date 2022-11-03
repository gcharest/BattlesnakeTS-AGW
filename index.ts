// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server';
import { GameState, InfoResponse, MoveResponse, Coord } from './types';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "",       // TODO: Your Battlesnake Username
    color: "#FF0000", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState: GameState): void {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState: GameState): MoveResponse {

  let isMoveSafe: { [key: string]: boolean; } = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds

  if (myHead.x === gameState.board.width - 1) {
    isMoveSafe.right = false;
  } else if (myHead.x === 0) {
    isMoveSafe.left = false;
  }
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  } else if (myHead.y === gameState.board.height - 1) {
    isMoveSafe.up = false;
  }
  // boardWidth = gameState.board.width;
  // boardHeight = gameState.board.height;

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // myBody = gameState.you.body;

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;

  let nextMoves = {
    left: { x: myHead.x - 1, y: myHead.y },
    right: { x: myHead.x + 1, y: myHead.y },
    up: { x: myHead.x, y: myHead.y + 1 },
    down: { x: myHead.x, y: myHead.y - 1 }
  };

  // Parse unsafe spaces
  let unsafeSpaces: Coord[] = [];

  gameState.board.snakes.forEach(snake => {
    unsafeSpaces = unsafeSpaces.concat(snake.body)
  });

  if (unsafeSpaces.findIndex(space => { return space.x === nextMoves.left.x && space.y === nextMoves.left.y }) !== -1) {
    isMoveSafe.left = false
  }
  if (unsafeSpaces.findIndex(space => { return space.x === nextMoves.right.x && space.y === nextMoves.right.y }) !== -1) {
    isMoveSafe.right = false
  }
  if (unsafeSpaces.findIndex(space => { return space.x === nextMoves.up.x && space.y === nextMoves.up.y }) !== -1) {
    isMoveSafe.up = false
  }
  if (unsafeSpaces.findIndex(space => { return space.x === nextMoves.down.x && space.y === nextMoves.down.y }) !== -1) {
    isMoveSafe.down = false
  }


  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  // TODO: Isolate safe moves (up, down, right, left)

  // TODO: Parse food spaces

  // Log details about each turn

  // console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  // console.log(`head x : ${JSON.stringify(myHead.x)}`);
  // console.log(`head y: ${JSON.stringify(myHead.y)}`);
  // console.log(`width: ${JSON.stringify(gameState.board.width)}`);
  // console.log(`HEALTH: ${gameState.you.health}`);
  // console.log(`Body Length: ${gameState.you.body.length}`);
  //console.log(`Body: ${JSON.stringify(gameState.you.body)}`);
  // console.log(`Snakes: ${JSON.stringify(gameState.board.snakes)}`)
  // console.log(`UnsafeSpaces: ${JSON.stringify(unsafeSpaces)}\n---\n`)



  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
