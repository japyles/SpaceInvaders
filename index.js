// define the state and behaviour needed
const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  alienPositions: [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23, 24, 25, 26, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  ],
  gameover: false,
  score: 0,
};

const setupGame = (element) => {
  state.element = element;
  // do all things needed to draw the game
  // draw the grid
  drawGrid();
  // draw the spaceship
  drawShip();
  // draw the aliens
  drawAliens();
  // add the instructions and the score
  drawScoreboard();
};

const drawGrid = () => {
  // create the containing element (div)
  const grid = document.createElement('div');
  grid.classList.add('grid');
  //   insert grid into the app
  state.element.append(grid);
  // create a LOT of cells - 15x15 (225)
  for (let i = 0; i < state.numCells; i++) {
    // create a cell
    const cell = document.createElement('div');
    // store the cell in the game state
    state.cells.push(cell);
    // append the cell to the grid
    grid.append(cell);
  }

  // append the cells to the containing element and the containing element to the app
  //   state.element.append(grid);
};

const drawShip = () => {
  // find starting point
  // find the bottom row, middle cell (from game state), add a background image
  state.cells[state.shipPosition].classList.add('spaceship');
};

const controlShip = (event) => {
  if (state.gameover) return;
  // if the key pressed is left
  if (event.code === 'ArrowLeft') {
    moveShip('left');
    // if right
  } else if (event.code === 'ArrowRight') {
    moveShip('right');
    // if space
  } else if (event.code === 'Space') {
    fire();
  }
};

const moveShip = (direction) => {
  // remove image from current position
  // grid boundaries using modulo (left side multiples of 15, right side (15 minus 1))
  state.cells[state.shipPosition].classList.remove('spaceship');
  // figure out the delta
  if (direction === 'left' && state.shipPosition % 15 !== 0) {
    state.shipPosition--;
  } else if (direction === 'right' && state.shipPosition % 15 !== 14) {
    state.shipPosition++;
  }

  //   add image to new position
  state.cells[state.shipPosition].classList.add('spaceship');
};

const fire = () => {
  // use an interval; run some code repeately each time after a specified time
  let interval;
  // laser starts at the ship position
  let laserPosition = state.shipPosition;
  interval = setInterval(() => {
    // remove the laser image
    state.cells[laserPosition].classList.remove('laser');
    // decrease (move up a row) the laser position
    laserPosition -= 15;
    // check we are still in bounds
    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }
    // if there's an alien, go BOOM!
    // clear the interval, remove the alien image, remove the alien from the alien positions, add the BOOM image, set a timeout to remove the BOOM image
    if (state.alienPositions.includes(laserPosition)) {
      clearInterval(interval);
      state.alienPositions.splice(
        state.alienPositions.indexOf(laserPosition),
        1
      );
      state.cells[laserPosition].classList.remove('alien'); // add 'laser'?
      state.cells[laserPosition].classList.add('hit');
      state.score++;
      state.scoreElement.innerText = state.score;
      setTimeout(() => {
        state.cells[laserPosition].classList.remove('hit');
      }, 200);
      return;
    }
    // add the laser image
    state.cells[laserPosition].classList.add('laser');
  }, 100);
};

const drawAliens = () => {
  // remove any alien images

  // adding the aliens to the grid -> we need to store the positions of the aliens in the state
  state.cells.forEach((cell, index) => {
    // remove
    if (cell.classList.contains('alien')) {
      cell.classList.remove('alien');
    }
    // add the image to the cell if the index is in the set of alien position
    if (state.alienPositions.includes(index)) {
      cell.classList.add('alien');
    }
  });
};

const play = () => {
  // start the march of the aliens!
  let interval;
  //   starting direction
  let direction = 'right';

  interval = setInterval(() => {
    let movement;
    // if right
    if (direction === 'right') {
      // if right and at the edge, increase position by 15, decrease by 1

      if (atEdge('right')) {
        movement = 15 - 1;
        direction = 'left';
      } else {
        // if right, increase position by 1
        movement = 1;
      }
    } else if (direction === 'left') {
      if (atEdge('left')) {
        movement = 15 + 1;
        direction = 'right';
      } else {
        movement = -1;
      }
    }

    // update alien positions
    state.alienPositions = state.alienPositions.map(
      (position) => position + movement
    );
    drawAliens();
    // check game state (and stop the aliens and the ship)
    checkGameState(interval);
  }, 400);
  // set up the ship controls
  window.addEventListener('keydown', controlShip);
};

const atEdge = (side) => {
  if (side === 'left') {
    // are any aliens in the left hand column?
    return state.alienPositions.some((position) => position % 15 === 0);
  } else if (side === 'right') {
    // are any aliens in the right hand column?
    return state.alienPositions.some((position) => position % 15 === 14);
  }
};

const checkGameState = (interval) => {
  // has the aliens got to the bottom

  // are the aliens all DEAD?!
  if (state.alienPositions.length === 0) {
    // stop everything
    clearInterval(interval);
    state.gameover = true;

    drawMessage('HUMAN WINS!');
  } else if (
    state.alienPositions.some((position) => position >= state.shipPosition)
  ) {
    clearInterval(interval);
    state.gameover = true;
    // make ship go boom!
    // remove the ship image, add the explosion image
    state.cells[state.shipPosition].classList.remove('spaceship');
    state.cells[state.shipPosition].classList.add('hit');
    drawMessage('GAME OVER!');
  }
};

const drawMessage = (message) => {
  // create message
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  //   create the heading text
  const h1 = document.createElement('h1');
  h1.innerText = message;
  messageElement.append(h1);
  // append it to the app
  state.element.append(messageElement);
};

drawScoreboard = () => {
  const heading = document.createElement('h1');
  heading.innerText = 'Space Invaders';
  const paragraph1 = document.createElement('p');
  paragraph1.innerText = 'Press SPACE to shoot';
  const paragraph2 = document.createElement('p');
  paragraph2.innerText = 'Press left arrow and right arrow to move';
  const scoreboard = document.createElement('div');
  scoreboard.classList.add('scoreboard');
  const scoreElement = document.createElement('span');
  scoreElement.innerText = state.score;
  const heading3 = document.createElement('h3');
  heading3.innerText = 'Score: ';
  heading3.append(scoreElement);
  scoreboard.append(heading, paragraph1, paragraph2, heading3);

  state.scoreElement = scoreElement;
  state.element.append(scoreboard);
};

// query the page for the place to insert my game
const appElement = document.querySelector('.app');

// do all the things needed to draw the game
setupGame(appElement);

// play the game - start being able to move the ship
play();
