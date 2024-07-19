import * as objects from "./objects.js";

var canvasbg = document.querySelector("#background");
var c = canvasbg.getContext("2d");
let bg_img = new Image();
bg_img.src = "breakout.avif";
bg_img.addEventListener("load", function () {
    c.drawImage(bg_img, 0, 0, canvasbg.width, canvasbg.height)
})

const canvas = document.querySelector("#canvas");
const screen = canvas.getContext("2d");

let bricks = [];
let paused = false;
let held_key = null;
let pressed_space = null;
let points = 0;
let level = 1 - 1;
let won = false;
let lives = 3 - 1;

let fps = 0;
let dt = 0;
let lastFrameTime = performance.now();
let framesThisSecond = 0;

let paddle = {
    ...objects.paddle_copy
}
let ball = {
    ...objects.ball_copy
}
let color_theme = objects.color_theme;

function updateFPS() {
    const now = performance.now();
    let elapsed = now - lastFrameTime;
    if (elapsed == 0) {
        elapsed = 0.01;
        console.log("fps is 0!! set variable 'fps' to 0.01 to avoid <division by 0> crash.");
    }

    lastFrameTime = now;

    const thisFrame = 1000 / elapsed;
    fps += (thisFrame - fps);

    framesThisSecond++;
    if (now > lastFrameTime + 1000) {
        fps = framesThisSecond;
        framesThisSecond = 0;
        lastFrameTime = now;
    }

    dt = 1 / fps;
}


function setup() {
    paused = true;
    won = false;
    let amount = 10;
    level++;
    lives++;
    let brick_width = (canvas.width / amount);
    for (let i = 0; i < level; i++) {
        for (let j = 0; j < amount; j++) {
            bricks.push(new objects.Brick(5 + brick_width * j, 40 + 50 * i));
        }
    }

    // reset paddle and ball
    paddle = {
        ...objects.paddle_copy
    }
    ball = {
        ...objects.ball_copy
    }

}
function get_events() {
    window.addEventListener("keyup", function (e) {
        held_key = null;
        if (e.key === " ") {
            pressed_space = true;
        }
    });
    window.addEventListener("keydown", function (e) {
        held_key = e.key;
    });
}

function draw() {
    screen.clearRect(0, 0, canvas.width, canvas.height);
    // screen.drawImage(bg_img, 0, 0, canvas.width, canvas.height);

    // New draw ball & paddle
    screen.beginPath();
    let g = screen.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y + paddle.height);
    g.addColorStop(0, "white");
    g.addColorStop(1, "gray");
    screen.fillStyle = g;
    screen.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    screen.fill();
    screen.closePath();
    // 
    // I should make this draw in a circle on 0 0 to the width instead of a rect
    screen.beginPath();
    let rg = screen.createRadialGradient(ball.x, ball.y, ball.radius, ball.x, ball.y, ball.radius * 2);
    rg.addColorStop(0, "white");
    rg.addColorStop(0.01, "white");
    rg.addColorStop(1, "transparent");
    rg.addColorStop(1, "transparent");
    screen.fillStyle = rg;
    screen.rect(0, 0, 600, 600);
    screen.fill();
    screen.closePath();

    // Old draw ball & paddle
    // screen.beginPath();
    // screen.fillStyle = paddle.color;
    // screen.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    // screen.fill();
    // screen.closePath();
    // 
    // screen.beginPath();
    // screen.fillStyle = ball.color;
    // screen.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    // screen.fill();
    // screen.closePath();

    for (let brick of bricks) {
        // Old draw bricks
        // brick.draw();

        // New draw bricks
        screen.beginPath();
        let g = screen.createLinearGradient(brick.x, brick.y, brick.x + brick.w, brick.y + brick.h);
        g.addColorStop(0, "white");
        g.addColorStop(1, "gray");
        screen.fillStyle = g;
        screen.rect(brick.x, brick.y, brick.w, brick.h);
        screen.fill();
        screen.closePath();
    }

    screen.textAlign = "left";
    screen.font = "16px Arial";
    screen.fillStyle = color_theme;
    screen.fillText("fps " + String(Math.round(fps)), canvas.width - 60, 20);
    screen.fillText("points: " + String(points), 10, 20);
    screen.fillText("lives: " + String(lives), 100, 20);
    screen.fillText("level: " + String(level), 200, 20);
    screen.textAlign = "center";

    if (paused) {
        screen.fillText("Game paused. Press [Space] to continue", canvas.width / 2, canvas.height / 2 - 20);
    }

    if (won && !(level === 7 || level === 12)) {
        screen.fillText("Congratulations, you cleared all the bricks in this level!", canvas.width / 2, canvas.height / 2);
        screen.fillText("Press E to enter next level.", canvas.width / 2, canvas.height / 2 + 20);
    }

    if (level == 7 && won) {
        screen.fillText("Congratulations, you have beat the normal game!", canvas.width / 2, canvas.height / 2);
        screen.fillText("Press E to continue to hard levels.", canvas.width / 2, canvas.height / 2 + 20);
        lives = 19;
    } else if (level == 12 && won) {
        screen.fillText("Congratulations, you have reached the very end! Thank you for playing!", canvas.width / 2, canvas.height / 2);
        screen.fillText("You can not go any further because any level more than 12 is just not possible.", canvas.width / 2, canvas.height / 2 + 20);
        lives = NaN;
    }

    if (lives <= 0) {
        screen.fillText("Refresh the page to start over.", canvas.width / 2, canvas.height / 2 + 40);
        screen.font = "32px Arial";
        screen.fillText("Game over!", canvas.width / 2, canvas.height / 2 + 10);
    }
}

function update() {
    if (pressed_space) {
        paused = !paused;
        pressed_space = false;
    }
    if (won && (held_key === "E" || held_key === "e")) {
        setup();
    }
    if (held_key === "R") {
        bricks = [];
    }

    updateFPS();

    if (!paused && !won && lives > 0) {
        paddle.update(dt, held_key);
        ball.update(dt, paddle, bricks);
        for (let i = 0; i < bricks.length; i++) {
            bricks[i].update();
            if (bricks[i].die) {
                bricks.splice(i, 1);
                i--;
            }
        }
        if (ball.signal_pause) {
            paused = true;
        }
        if (ball.lose_life) {
            lives--;
        }
        if (ball.add_point) {
            points++;
        }
    }

    if (bricks.length <= 0) {
        // console.log("Congratulations, you cleared all the bricks in this level!");
        won = true;
    }
}

function main() {
    get_events();
    update();
    draw();

    requestAnimationFrame(main);
}

setup();
main();
