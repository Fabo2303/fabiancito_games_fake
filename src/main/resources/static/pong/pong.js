const socket = new SockJS(rutas.base_game);
const stompClient = Stomp.over(socket);


const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 2,
    velocityY: 2,
    speed: 7,
    color: 'WHITE'
}

class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.score = 0;
    }
}

const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 5;
let upArrowPressed = false;
let downArrowPressed = false;
let playerRole = null
let connected = false;
let playersReady = 0;

const player1 = new Paddle(0, (canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, 'WHITE');
const player2 = new Paddle(canvas.width - paddleWidth, (canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, 'WHITE');

function connect() {
    stompClient.connect({}, () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe(rutas.queue_pong_role, (data) => {
            if (playerRole === null) {
                playerRole = parseInt(data.body);
            }
            console.log(`Assigned role: ${playerRole}`);
            if (isNaN(playerRole)) {
                console.error("Invalid role received:", data.body);
            }
        });

        stompClient.subscribe(rutas.queue_pong_ready, (data) => {
            playersReady = parseInt(data.body);
            console.log(`Players ready: ${playersReady}`);
            if (playersReady === 2) {
                console.log("Starting game");
                connected = true;
            }
        });

        stompClient.send("/app" + rutas.pong_join, {}, {});
        stompClient.send("/app" + rutas.pong_ready, {}, {});

        // Suscríbete a los canales necesarios
        stompClient.subscribe(rutas.game_pong_ball, (data) => {
            const ballMovement = JSON.parse(data.body);
            ball.x = ballMovement.positionX;
            ball.y = ballMovement.positionY;
            drawBall();
            drawPaddles();
        });

        stompClient.subscribe(rutas.game_pong_paddle_right, (data) => {
            const paddleMovement = JSON.parse(data.body);
            if (playerRole === 1) {
                return;
            }
            player1.y = paddleMovement.positionY;
        });

        stompClient.subscribe(rutas.game_pong_paddle_left, (data) => {
            const paddleMovement = JSON.parse(data.body);
            if (playerRole === 2) {
                return;
            }
            player2.y = paddleMovement.positionY;
        });
    });
}

function sendBallMovement() {
    const ballMovement = {
        positionX: ball.x,
        positionY: ball.y,
        speedX: ball.velocityX,
        speedY: ball.velocityY
    };
    //stompClient.send('/app' + rutas.pong_move_ball, {}, JSON.stringify(ballMovement));
}

function sendPaddleMovement() {
    let paddleMovement;
    if (playerRole === 1) {
        paddleMovement = {
            playerId: playerRole,
            positionY: player1.y
        };
        stompClient.send('/app' + rutas.pong_move_paddle_right, {}, JSON.stringify(paddleMovement));
    } else {
        paddleMovement = {
            playerId: playerRole,
            positionY: player2.y
        };
        stompClient.send('/app' + rutas.pong_move_paddle_left, {}, JSON.stringify(paddleMovement));
    }
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddles() {
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
}

function moveBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    if (ball.x - ball.radius <= paddleWidth && ball.y >= player1.y && ball.y <= player1.y + paddleHeight) {
        ball.velocityX = -ball.velocityX;
    }

    if (ball.x + ball.radius >= canvas.width - paddleWidth && ball.y >= player2.y && ball.y <= player2.y + paddleHeight) {
        ball.velocityX = -ball.velocityX;
    }

    if (ball.x - ball.radius <= 0) {
        player2.score++;
        resetBall();
    }

    if (ball.x + ball.radius >= canvas.width) {
        player1.score++;
        resetBall();
    }

    sendBallMovement();
}

function movePaddles() {
    if (playerRole === 1) {
        if (upArrowPressed && player1.y > 0) {
            player1.y -= paddleSpeed;
        }
        if (downArrowPressed && player1.y < canvas.height - paddleHeight) {
            player1.y += paddleSpeed;
        }
    } else {
        if (upArrowPressed && player2.y > 0) {
            player2.y -= paddleSpeed;
        }
        if (downArrowPressed && player2.y < canvas.height - paddleHeight) {
            player2.y += paddleSpeed;
        }
    }
    sendPaddleMovement();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 2;
    ball.velocityY = 2;
    player1Score.innerHTML = player1.score;
    player2Score.innerHTML = player2.score;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        upArrowPressed = true;
    }
    if (e.key === 'ArrowDown') {
        downArrowPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        upArrowPressed = false;
    }
    if (e.key === 'ArrowDown') {
        downArrowPressed = false;
    }
});


function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (connected) {
        drawBall();
        drawPaddles();
        moveBall();
        movePaddles();
    }
    requestAnimationFrame(update);
}

function startGame() {
    connect();
    update();
}

startGame();