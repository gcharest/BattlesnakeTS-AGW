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

import e from 'express';
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
  // keep track of things
  let things = {
    nextCoords: {
      left: { x: gameState.you.head.x - 1, y: gameState.you.head.y },
      right: { x: gameState.you.head.x + 1, y: gameState.you.head.y },
      up: { x: gameState.you.head.x, y: gameState.you.head.y + 1 },
      down: { x: gameState.you.head.x, y: gameState.you.head.y - 1 }
    },
    boardInfo: {
      hCenter: (gameState.board.width % 2 > 0 ? ((gameState.board.width - 1) / 2 + 1) : (gameState.board.width / 2)),
      vCenter: (gameState.board.height % 2 > 0 ? ((gameState.board.height - 1) / 2 + 1) : (gameState.board.height / 2)),
    }
  }

  let possibleMoves = {
    left: {
      isMoveSafe: true,
      isMoveTowardsCenter: checkCenter(things.nextCoords.left.x, things.nextCoords.left.y),
      coords: things.nextCoords.left,
    },
    right: {
      isMoveSafe: true,
      isMoveTowardsCenter: checkCenter(things.nextCoords.right.x, things.nextCoords.right.y),
      coords: things.nextCoords.right,
    },
    up: {
      isMoveSafe: true,
      isMoveTowardsCenter: checkCenter(things.nextCoords.up.x, things.nextCoords.up.y),
      coords: things.nextCoords.up,
    },
    down: {
      isMoveSafe: true,
      isMoveTowardsCenter: checkCenter(things.nextCoords.down.x, things.nextCoords.down.y),
      coords: things.nextCoords.down,
    },
  }

  // if (things.boardInfo.myNeck.x < things.boardInfo.myHead.x) {        // Neck is left of head, don't move left
  //   possibleMoves.left.isMoveSafe = false;

  // } else if (things.boardInfo.myNeck.x > things.boardInfo.myHead.x) { // Neck is right of head, don't move right
  //   possibleMoves.right.isMoveSafe = false;

  // } else if (things.boardInfo.myNeck.y < things.boardInfo.myHead.y) { // Neck is below head, don't move down
  //   possibleMoves.down.isMoveSafe = false;

  // } else if (things.boardInfo.myNeck.y > things.boardInfo.myHead.y) { // Neck is above head, don't move up
  //   possibleMoves.up.isMoveSafe = false;
  // }

  // Step 1 - Prevent your Battlesnake from moving out of bounds
  if (gameState.you.head.x === gameState.board.width - 1) {
    possibleMoves.right.isMoveSafe = false;
  } else if (gameState.you.head.x === 0) {
    possibleMoves.left.isMoveSafe = false;
  }
  if (gameState.you.head.y === 0) {
    possibleMoves.down.isMoveSafe = false;
  } else if (gameState.you.head.y === gameState.board.height - 1) {
    possibleMoves.up.isMoveSafe = false;
  }
  // boardWidth = gameState.board.width;
  // boardHeight = gameState.board.height;

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // myBody = gameState.you.body;

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;


  // Avoid spaces that contain snakes (including us)
  let unsafeSpaces: Coord[] = [];

  gameState.board.snakes.forEach(snake => {
    unsafeSpaces = unsafeSpaces.concat(snake.body)
  });

  if (unsafeSpaces.findIndex(space => { return space.x === possibleMoves.left.coords.x && space.y === possibleMoves.left.coords.y }) !== -1) {
    possibleMoves.left.isMoveSafe = false
  }
  if (unsafeSpaces.findIndex(space => { return space.x === possibleMoves.right.coords.x && space.y === possibleMoves.right.coords.y }) !== -1) {
    possibleMoves.right.isMoveSafe = false
  }
  if (unsafeSpaces.findIndex(space => { return space.x === possibleMoves.up.coords.x && space.y === possibleMoves.up.coords.y }) !== -1) {
    possibleMoves.up.isMoveSafe = false
  }
  if (unsafeSpaces.findIndex(space => { return space.x === possibleMoves.down.coords.x && space.y === possibleMoves.down.coords.y }) !== -1) {
    possibleMoves.down.isMoveSafe = false
  }



  // Are there any safe moves left?
  // @ts-ignore
  const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key].isMoveSafe);
  console.log('safemoves', possibleMoves);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  let nextMove;

  // favor moving towards the center
  // @ts-ignore
  const centerMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key].isMoveSafe && possibleMoves[key].isMoveTowardsCenter);
  console.log('centermoves', centerMoves, centerMoves.length);
  // if (centerMoves.length > 0) {
  //   // if there are safe moves that are going towards the center, choose it
  //   nextMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
  // }
  // else {
  // otherwise, choose one at random
  nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // }

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  // TODO: Isolate safe moves (up, down, right, left)

  // TODO: Parse food spaces

  // Log details about each turn

  if (gameState.turn === 0) {
    console.log('gs', JSON.stringify(gameState));
  }
  // console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  // console.log(`head x : ${JSON.stringify(things.boardInfo.myHead.x)}`);
  // console.log(`head y: ${JSON.stringify(things.boardInfo.myHead.y)}`);
  // console.log(`width: ${JSON.stringify(gameState.board.width)}`);
  // console.log(`HEALTH: ${gameState.you.health}`);
  // console.log(`Body Length: ${gameState.you.body.length}`);
  //console.log(`Body: ${JSON.stringify(gameState.you.body)}`);
  // console.log(`Snakes: ${JSON.stringify(gameState.board.snakes)}`)
  // console.log(`UnsafeSpaces: ${JSON.stringify(unsafeSpaces)}\n---\n`)

  // determine if given move goes closer to center or not
  function checkCenter(nextX: number, nextY: number) {
    if (Math.abs(nextX - things.boardInfo.hCenter) < Math.abs(gameState.you.head.x - things.boardInfo.hCenter))
      return true;
    if (Math.abs(nextY - things.boardInfo.vCenter) < Math.abs(gameState.you.head.y - things.boardInfo.vCenter))
      return true;

    return false;
  }

  return { move: nextMove };
}


runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
