const socket = new SockJS(rutas.base_game);
const stompClient = Stomp.over(socket);

const canvas = document.getElementById('tictactoe');
const ctx = canvas.getContext('2d');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const winner = document.getElementById('winner');

const TILE_SIZE = canvas.width / 3;
const BOARD_SIZE = 3;
const BOARD_WIDTH = TILE_SIZE * BOARD_SIZE;
const BOARD_HEIGHT = TILE_SIZE * BOARD_SIZE;

const positions = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const TOKEN_1_VALUE = 1;
const TOKEN_2_VALUE = 4;

let turn = 1;
let reset = false;

let playerRole = null;
let connected = false;
let playersReady = 0;

function connect() {
    stompClient.connect({}, () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe(rutas.queue_tictactoe_role, (data) => {
            if (playerRole === null) {
                playerRole = parseInt(data.body);
            }
            console.log(`Assigned role: ${playerRole}`);
            if (isNaN(playerRole)) {
                console.error("Invalid role received:", data.body);
            }
        });

        stompClient.subscribe(rutas.queue_tictactoe_ready, (data) => {
            playersReady = parseInt(data.body);
            console.log(`Players ready: ${playersReady}`);
            if (playersReady === 2) {
                connected = true;
            }
        });

        stompClient.send("/app" + rutas.tictactoe_join, {}, {});
        stompClient.send("/app" + rutas.tictactoe_ready, {}, {});

        stompClient.subscribe(rutas.game_tictactoe, (data) => {
            console.log(data.body);
            let message = JSON.parse(data.body);
            placeToken(message.positionX, message.positionY, message.playerID);
        });
    });
}

function drawBoard(){
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

function drawToken(x, y, player=null, color=null){
    let centerX = TILE_SIZE * x + TILE_SIZE / 2;
    let centerY = TILE_SIZE * y + TILE_SIZE / 2;
    let radius = TILE_SIZE / 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    if(player === 1){
        ctx.fillStyle = 'red';
    }
    else if(player === 2){
        ctx.fillStyle = 'blue';
    }
    else if(color){
        ctx.fillStyle = color;
    }
    ctx.fill();
}

function placeToken(x, y){
    let index = y * BOARD_SIZE + x;
    if(positions[index] === 0){
        positions[index] = turn === 1 ? TOKEN_1_VALUE : TOKEN_2_VALUE;
        drawToken(x, y, turn);
        checkWinner();
    }
}

function checkWinner(){
    const sums = [
        { token: '00 10 20', value: positions[0] + positions[1] + positions[2] },
        { token: '01 11 21', value: positions[3] + positions[4] + positions[5] },
        { token: '02 12 22', value: positions[6] + positions[7] + positions[8] },
        { token: '00 01 02', value: positions[0] + positions[3] + positions[6] },
        { token: '10 11 12', value: positions[1] + positions[4] + positions[7] },
        { token: '20 21 22', value: positions[2] + positions[5] + positions[8] },
        { token: '00 11 22', value: positions[0] + positions[4] + positions[8] },
        { token: '02 11 20', value: positions[2] + positions[4] + positions[6] }
    ];
    for (let i = 0; i < sums.length; i++) {
        const { token, value } = sums[i];

        if (value === 3) {
            player1Score.textContent = parseInt(player1Score.textContent) + 1;
            winner.textContent = 'Player 1 wins!';
            highlightWinningCells(token);
            reset = true;
            setTimeout(() => {
                resetGame();
            }, 3000);
            return;
        } else if (value === 12) {
            player2Score.textContent = parseInt(player2Score.textContent) + 1;
            winner.textContent = 'Player 2 wins!';
            highlightWinningCells(token);
            reset = true;
            setTimeout(() => {
                resetGame();
            }, 3000);
            return;
        }
    }

    if (positions.every(position => position !== 0)) {
        winner.textContent = 'It\'s a draw!';
        reset = true;
        setTimeout(() => {
            resetGame();
        }, 3000);
        return;
    }

    changeTurn();
}

function highlightWinningCells(token) {
    token.split(' ').forEach(index => {
        const x = parseInt(index[0]);
        const y = parseInt(index[1]);
        let color = 'yellow';
        drawToken(x, y, player=null, color);
    });
}

function resetGame(){
    positions.fill(0);
    turn = 1;
    reset = false;
    winner.textContent = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
}

function changeTurn(){
    turn = turn === 1 ? 2 : 1;
}

canvas.addEventListener('click', function(event){
    if(reset){
        return;
    }
    let x = Math.floor(event.offsetX / TILE_SIZE);
    let y = Math.floor(event.offsetY / TILE_SIZE);
    if (connected && playerRole === turn) {
        stompClient.send("/app" + rutas.tictactoe_move, {}, JSON.stringify({
            positionX: x,
            positionY: y,
            playerID: playerRole
        }));
    }
});



function update() {
    if (connected) {
        drawBoard();
    }
    requestAnimationFrame(update);
}

function startGame() {
    connect();
    update();
}

startGame();