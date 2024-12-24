const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');

const tableSums = {
    h1: 0,
    h2: 0,
    h3: 0,
    v1: 0,
    v2: 0,
    v3: 0,
    d1: 0,
    d2: 0,
}

const TOKEN_1_VALUE = 1;
const TOKEN_2_VALUE = 4;

const TILE_SIZE = canvas.width / 3;
const BOARD_SIZE = 3;
const BOARD_WIDTH = TILE_SIZE * BOARD_SIZE;
const BOARD_HEIGHT = TILE_SIZE * BOARD_SIZE;

const PLAYER_1 = 1;
const PLAYER_2 = 2;
let turn = 1;

function drawTable(){
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for(let i = 1; i < BOARD_SIZE; i++){
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, BOARD_HEIGHT);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(BOARD_WIDTH, i * TILE_SIZE);
        ctx.stroke();
    }
}

function drawToken(x, y, player){
    let centerX = TILE_SIZE * x + TILE_SIZE / 2;
    let centerY = TILE_SIZE * y + TILE_SIZE / 2;
    let radius = TILE_SIZE / 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = player === PLAYER_1 ? 'red' : 'blue';
    ctx.fill();
}

function putToken(x, y, player){
    let sum = player === PLAYER_1 ? TOKEN_1_VALUE : TOKEN_2_VALUE;
    tableSums['h' + (y + 1)] += sum;
    tableSums['v' + (x + 1)] += sum;
    if(x === y){
        tableSums['d1'] += sum;
    }
    if(x + y === BOARD_SIZE - 1){
        tableSums['d2'] += sum;
    }
    console.log(tableSums);
    drawToken(x, y, player);
}

function checkWinner(){
    for(let key in tableSums){
        if(tableSums[key] === BOARD_SIZE * TOKEN_1_VALUE){
            alert('Player 1 wins');
            resetGame();
        } else if(tableSums[key] === BOARD_SIZE * TOKEN_2_VALUE){
            alert('Player 2 wins');
            resetGame();
        }
    }
}

function resetGame(){
    tableSums.h1 = 0;
    tableSums.h2 = 0;
    tableSums.h3 = 0;
    tableSums.v1 = 0;
    tableSums.v2 = 0;
    tableSums.v3 = 0;
    tableSums.d1 = 0;
    tableSums.d2 = 0;
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

function changeTurn(){
    turn = turn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
}

canvas.addEventListener('click', function(event){
    let x = Math.floor(event.offsetX / TILE_SIZE);
    let y = Math.floor(event.offsetY / TILE_SIZE);
    putToken(x, y, turn);
    changeTurn();
    checkWinner();
});

function update(){
    drawTable();
    requestAnimationFrame(update);
}

update();