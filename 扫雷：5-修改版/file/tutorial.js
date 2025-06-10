const ROWS = 8;
const COLS = 8;
let MINES = 5;
let firstClick = true;
const minefield = document.getElementById('minefield');

let board = [];

function setDifficulty(mines) {
    MINES = mines;
    resetGame();
}

function checkWin() {
    let unrevealedSafeCells = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!board[i][j].isMine && !board[i][j].revealed) {
                unrevealedSafeCells++;
            }
        }
    }
    if (unrevealedSafeCells === 0) {
        resetGame();
        alert('你赢了!');
        window.location.href = "./minesweeper.html";

    }
}

function resetGame() {
    minefield.innerHTML = '';
    board = [];
    firstClick = true; 
    createBoard();
}

function createBoard() {
    for (let i = 0; i < ROWS; i++) {
        let row = [];
        for (let j = 0; j < COLS; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', flagCell); 
            cell.addEventListener('mouseenter', highlightCells);
            cell.addEventListener('mouseleave', removeHighlight);
            minefield.appendChild(cell);
            row.push({ cell: cell, isMine: false, revealed: false, flagged: false });
        }
        board.push(row);
    }
    placeMines();
}

function flagCell(event) {
    event.preventDefault(); 
    let cell = event.target;
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    if (!board[row][col].revealed) {
        if (board[row][col].flagged) {
            cell.textContent = ''; 
            board[row][col].flagged = false;
        } else {
            cell.textContent = '🚩'; 
            board[row][col].flagged = true;
        }
    }
}

function highlightCells(event) {
    let cell = event.target;
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    for (let i = Math.max(0, row - 2); i <= Math.min(ROWS - 1, row + 2); i++) {
        for (let j = Math.max(0, col - 2); j <= Math.min(COLS - 1, col + 2); j++) {
            board[i][j].cell.classList.add('highlight');
        }
    }
}

function removeHighlight(event) {
    let cell = event.target;
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    for (let i = Math.max(0, row - 2); i <= Math.min(ROWS - 1, row + 2); i++) {
        for (let j = Math.max(0, col - 2); j <= Math.min(COLS - 1, col + 2); j++) {
            board[i][j].cell.classList.remove('highlight');
        }
    }
}


function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

function revealCell(event) {
    let cell = event.target;
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    if (firstClick) {
        if (board[row][col].isMine) {
            placeMines();
            if (board[row][col].isMine) {
                while (board[row][col].isMine) {
                    placeMines();
                }
            }
        }
        firstClick = false;
    }

    if (board[row][col].isMine) {
        cell.classList.add('mine');
        resetGame();
    } else {
        cell.classList.add('revealed');
        board[row][col].revealed = true;
        let minesCount = countAdjacentMines(row, col);
        if (minesCount > 0) {
            cell.textContent = minesCount;
        } else {
            revealAdjacentCells(row, col);
        }
        checkWin(); 
    }
}

function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = Math.max(0, row - 2); i <= Math.min(ROWS - 1, row + 2); i++) {
        for (let j = Math.max(0, col - 2); j <= Math.min(COLS - 1, col + 2); j++) {
            if (board[i][j].isMine) {
                count++;
            }
        }
    }
    return count;
}

function revealAdjacentCells(row, col) {
    for (let i = Math.max(0, row - 2); i <= Math.min(ROWS - 1, row + 2); i++) {
        for (let j = Math.max(0, col - 2); j <= Math.min(COLS - 1, col + 2); j++) {
            if (!board[i][j].revealed) {
                board[i][j].revealed = true;
                board[i][j].cell.classList.add('revealed');
                let minesCount = countAdjacentMines(i, j);
                if (minesCount > 0) {
                    board[i][j].cell.textContent = minesCount;
                } else {
                    revealAdjacentCells(i, j);
                }
            }
        }
    }
}

function resetGame() {
    minefield.innerHTML = '';
    board = [];
    createBoard();
}

createBoard();      // QZ 47 66
