const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const touchLeft = document.querySelector('.touch-left')
const touchRight = document.querySelector('.touch-right')
const rules = document.getElementById('rules')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let score = 0
let winningScore = 45
let brickRowCount = 9;
let brickColumnCount = 5;
// ball position on Y
let ballY = canvas.height / 2
// Brick position on X
let brickX = 45

// for smartphones
if (window.innerWidth < 805) {
    canvas.width = 350
    canvas.height = window.innerHeight / 1.2
    winningScore = 32
    brickRowCount = 4
    brickColumnCount = 8
    ballY = canvas.height / 1.5
    brickX = 20
}

// Create ball props
let ball = {
    x: canvas.width / 2,
    y: ballY,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};


// Create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
}

// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#333'
    ctx.fill();
    ctx.closePath();
}

// Create brick props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: brickX,
    offsetY: 60,
    visible: true
}

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}

// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#e6a224' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}



// Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath()
}

// Draw score on canvas
function drawScore() {
    ctx.font = '20px comic sans ms';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}
// Draw high score on canvas 

function drawHighScore() {
    ctx.font = '20px comic sans ms';
    ctx.fillStyle = 'green'
    ctx.fillText(`High Score: ${localStorage.getItem('highscore')}`, 20, 30)
}

// Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall colision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top/bottom) 
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y) {
        ball.dy = -ball.speed;
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }

            }
        })
    })

    // Hit bottom wall - lose 
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();

        if (score > localStorage.getItem('highscore')) {
            localStorage.setItem('highscore', score);
        }

        score = 0;

    }
}

// Increase score
function increaseScore() {
    score++;

    if (score === winningScore) {
        showAllBricks();
        alert('Congrats, WOW YOU WON!')
    }
}

// Make all bricks appear 
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true;
        })
    })
}


// Draw everything
function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawPaddle()
    drawBall();
    drawScore();
    drawHighScore();
    drawBricks();
}

// update canvas drawing and animation
function update() {
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}

// Keyup event
function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}


// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.addEventListener('touchstart', (e) => {

    paddle.speed = 8
    if (e.touches[0].clientX < window.innerWidth / 2) {
        paddle.dx = -paddle.speed
        touchLeft.classList.add('animate')

    } else {
        paddle.dx = paddle.speed
        touchRight.classList.add('animate')

    }

})
window.addEventListener('touchend', (e) => {
    paddle.speed = 0
    paddle.dx = paddle.speed
    touchRight.classList.remove('animate')
    touchLeft.classList.remove('animate')
})
// Rules and close event handlers
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
})
closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
})