

const $board = $('#board');
let currentPlayer = 'black';
let gameBoard = Array(8).fill(null).map(() => Array(8).fill(null));

//ボードの作成
function createBoard() {
    $board.empty();
    gameBoard.forEach((row, rowIndex) => {
        row.forEach((cell, coIndex) => {
            const $cell = $('<div>').addClass('cell').data({ row: rowIndex, col: coIndex});
            //白と黒の駒を置く設定
            $cell.on('click', handleCellClick);
            if(cell) {
                $cell.append($('<div>').addClass('disc').addClass(cell));
            }
            $board.append($cell);
        });
    });
}

//初期設定を行う（真ん中に駒を置く）
function initializeGame() {
    gameBoard[3][3] = 'white';
    gameBoard[3][4] = 'black';
    gameBoard[4][3] = 'black';
    gameBoard[4][4] = 'white';
    createBoard();
}

//クリックしたセルに駒を置けるようにする処理
function handleCellClick() {
    const $target = $(this);
    const row = $target.data('row'); //行番号を取得する
    const col = $target.data('col'); //列番号を取得する

//クリックされた場所が有効な場所か判定
    if (!isValidMove(row, col)) return; 
    makeMove(row, col);
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    createBoard();
}

//駒をひっくり返す処理

//クリックされた場所に駒が置かれている場合falseを指定
function isValidMove(row, col) {
    if (gameBoard[row][col]) return false;
    return directions.some(direction => canFlip(row, col, direction, currentPlayer));
}

//場所の指定
const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];

//駒をひっくり返せれるかチェックする
function canFlip(row, col, [dx, dy], player) {
    let x = row + dx, y = col + dy, count = 0;
    while (isValidPosition(x, y) && gameBoard[x][y] && gameBoard[x][y] !== player) {
        x += dx;
        y += dy;
        count++;
    }
    return count > 0 && isValidPosition(x, y) && gameBoard[x][y] === player;
}

//盤面の範囲内か確認
function isValidPosition(x,y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

//相手の駒を自分の色にひっくり返す
function makeMove(row, col) {
    gameBoard[row][col] = currentPlayer;
    directions.forEach(direction => {
        if(canFlip(row,col, direction, currentPlayer)) {
            flipDiscs(row,col,direction,currentPlayer);
        }
    });
}

function flipDiscs(row,col, [dx, dy], player) {
    let x = row + dx, y = col + dy;
    while(isValidPosition(x,y) && gameBoard[x][y] && gameBoard[x][y] !== player) {
        gameBoard[x][y] = player;
        x += dx;
        y += dy;
    }
}

//リセットされた場合の処理
function restartGame() {
    gameBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    currentPlayer = 'black';
    initializeGame();
}

$(document).ready(initializeGame);