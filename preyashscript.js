const gridSelection = document.getElementById('grid-selection');
const startButton = document.getElementById('start-button');
const gridSizeSelector = document.getElementById('grid-size');
const gameContainer = document.getElementById('game-container');
const gameBoard = document.getElementById('game-board');
const statusText = document.getElementById('status');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');

let isXTurn = true;
let gridSize, cells, timer, timerInterval;

startButton.addEventListener('click', () => {
    gridSize = parseInt(gridSizeSelector.value);
    startGame();
});

restartButton.addEventListener('click', startGame);

function startGame() {
    clearInterval(timerInterval);
    gridSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    cells = [];
    isXTurn = true;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick, { once: true });
        gameBoard.appendChild(cell);
        cells.push(cell);
    }

    setStatusText('X\'s turn');
    startTimer();
}

function handleClick(e) {
    const cell = e.target;
    const currentMarker = isXTurn ? 'X' : 'O';
    placeMark(cell, currentMarker);
    if (checkWin(currentMarker)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setStatusText(`${isXTurn ? 'X' : 'O'}'s turn`);
        startTimer();
    }
}

function placeMark(cell, currentMarker) {
    cell.textContent = currentMarker;
}

function swapTurns() {
    isXTurn = !isXTurn;
}

function setStatusText(text) {
    statusText.innerText = text;
}

function checkWin(currentMarker) {
    const winCombinationSize = gridSize;
    const winCombinations = getWinCombinations(winCombinationSize);
    return winCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentMarker;
        });
    });
}

function getWinCombinations(size) {
    const combinations = [];
    
    for (let row = 0; row < size; row++) {
        const rowCombination = [];
        for (let col = 0; col < size; col++) {
            rowCombination.push(row * size + col);
        }
        combinations.push(rowCombination);
    }

    for (let col = 0; col < size; col++) {
        const colCombination = [];
        for (let row = 0; row < size; row++) {
            colCombination.push(row * size + col);
        }
        combinations.push(colCombination);
    }
   
    const diag1Combination = [];
    for (let i = 0; i < size; i++) {
        diag1Combination.push(i * size + i);
    }
    combinations.push(diag1Combination);
    
    const diag2Combination = [];
    for (let i = 0; i < size; i++) {
        diag2Combination.push(i * size + (size - 1 - i));
    }
    combinations.push(diag2Combination);
    return combinations;
}

function isDraw() {
    return cells.every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function endGame(draw) {
    clearInterval(timerInterval);
    if (draw) {
        setStatusText('Draw!');
    } else {
        setStatusText(`${isXTurn ? 'X' : 'O'} Wins!`);
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timer = 20;
    timerElement.textContent = timer;
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            swapTurns();
            setStatusText(`${isXTurn ? 'X' : 'O'}'s turn (Automatic turn)`);
            startTimer();
        }
    }, 1000);
}
