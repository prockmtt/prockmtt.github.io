//first, define HTML elements whose interactions r controlled by js
const board = document.getElementById('game-board');

//define game variables
const gridSize = 20;
const instructionText = document.getElementById('instructions');
const logo = document.getElementById('snake-logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('high-score');
let snake = [{x:10, y:10}];
//snake is an array of positions, starting from ~middle of board at game start
let food = genFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false; //bool keeps track of game start


//draws game board, snake, and food
function draw () {
    board.innerHTML = '';
    //resets board each round
    drawSnake();
    drawFood();
    updateScore();
}

//draws snake
function drawSnake() {
    snake.forEach((segment) => {
        //arrow function = runs this code on each element in snake
        const snakeElement = createGameElement('div', 'snake');
        setPos(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

//creates food or snake cube
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//sets position of snake or food on board
function setPos(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//draws food
function drawFood() {
    if (gameStarted) {
        const foodElem = createGameElement('div', 'food');
        setPos(foodElem, food);
        board.appendChild(foodElem);
    }
}

//generates a random pos on the board for food to spawn
function genFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

//move snake 
function move() {
const head = {...snake[0]};
switch (direction) {
    case 'right':
        head.x++;
        break;
    case 'left':
        head.x--;
        break;
    case 'up':
        head.y--;
        break;

    case 'down':
        head.y++;
        break;
}
snake.unshift(head);
if (head.x === food.x && head.y === food.y) {
    //if snake eats food, make new food and skip snake pop (see else stmt)
    food = genFood(); 
    increaseSpeed();
    //makes gameplay faster as more food is eaten
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}
else {
    snake.pop();
    //moving snake is visually kinda like generating a new snake seg at its new pos, popping
    //snake prevents it from growing as it moves
}
}

//start game
function startGame() {
    gameStarted = true; //now we know the game is running
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//keypress event listener; when player interacts, performs according actions
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || 
    (!gameStarted && event.key === ' ')) {
        //diff browsers refer to keypresses differently
        startGame();
}
else {
    switch (event.key) {
        case 'ArrowUp':
        case 'W':
        case 'w':
            if (direction !== 'down') {
                direction = 'up'; 
            } 
            break;
        case 'ArrowDown':
        case 'S':
        case 's':
            if (direction !== 'up') {
                direction = 'down';
            } 
            break;
        case 'ArrowLeft':
        case 'A':
        case 'a':
            if (direction !== 'right') {
                direction = 'left';
            } 
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
}
}

document.addEventListener('keydown', handleKeyPress);
//game now keeps track of keypresses

//checks if snake ran into walls or itself
function checkCollision() {
const head = snake[0];
if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
}
for (let i = 1; i < snake.length; i++) {
if (head.x === snake[i].x && head.y === snake[i].y) {
    resetGame();
}
}
}

//increases game speed
function increaseSpeed() {
if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
}
else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
}
else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
}
else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
}
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = genFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const scoreVal = (snake.length - 1);
    score.textContent = scoreVal.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
    //makes logo and text visible again
}


function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}