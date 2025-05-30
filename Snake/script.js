const gridSize = 20;
let gameGrid = [];
let snake = [];
let direction = { x: 1, y: 0 };
let apple = { x: 0, y: 0 };

// Initialize the game
function initGame() {
  createGrid();
  spawnSnake();
  spawnApple();
  startGameLoop();
}

// Create game field
function createGrid() {
  const table = document.getElementById("game-field");
  table.innerHTML = ""; // Clear previous grid if any
  gameGrid = [];

  for (let y = 0; y < gridSize; y++) {
    const row = document.createElement("tr");
    const rowCells = [];

    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("td");
      cell.classList.add("cell", "empty");
      row.appendChild(cell);
      rowCells.push(cell);
    }

    table.appendChild(row);
    gameGrid.push(rowCells);
  }
}

// Create initial snake body
function spawnSnake() {
  snake = [
    { x: Math.floor(gridSize / 2), y: 5 },
    { x: Math.floor(gridSize / 2), y: 4 },
    { x: Math.floor(gridSize / 2), y: 3 },
    { x: Math.floor(gridSize / 2), y: 2 },
    { x: Math.floor(gridSize / 2), y: 1 }
  ];
}

// Place apple randomly
function spawnApple() {
  apple.x = Math.floor(Math.random() * gridSize);
  apple.y = Math.floor(Math.random() * gridSize);
}

// Draw snake, apple and empty cells
function renderGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      gameGrid[y][x].className = "cell empty";
    }
  }

  for (const segment of snake) {
    gameGrid[segment.y][segment.x].className = "cell snake";
  }

  gameGrid[apple.y][apple.x].className = "cell apple";
}

// Update snake position
function updateSnake() {
  const head = snake[snake.length - 1];
  let newHead = {
    x: (head.x + direction.x + gridSize) % gridSize,
    y: (head.y + direction.y + gridSize) % gridSize
  };

  // Check for self-collision
  if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    alert("Game over!");
    initGame();
    return false;
  }

  snake.push(newHead);

  // Check if apple eaten
  if (newHead.x === apple.x && newHead.y === apple.y) {
    spawnApple();
  } else {
    snake.shift(); // Remove tail
  }

  return true;
}

// Control snake direction
document.addEventListener("keydown", event => {
  const key = event.keyCode;
  let newDirection = { x: 0, y: 0 };

  if (key === 37) newDirection = { x: -1, y: 0 }; // Left
  else if (key === 38) newDirection = { x: 0, y: -1 }; // Up
  else if (key === 39) newDirection = { x: 1, y: 0 }; // Right
  else if (key === 40) newDirection = { x: 0, y: 1 }; // Down

  // Prevent snake from reversing directly
  if (
    (newDirection.x !== 0 && newDirection.x !== -direction.x) ||
    (newDirection.y !== 0 && newDirection.y !== -direction.y)
  ) {
    direction = newDirection;
  }
});

// Game loop
function startGameLoop() {
  const gameInterval = setInterval(() => {
    if (!updateSnake()) {
      clearInterval(gameInterval);
      return;
    }

    renderGrid();
  }, 200);
}

// Start everything
initGame();