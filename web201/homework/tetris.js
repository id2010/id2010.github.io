import { square, tilemap } from "./blocks.js";

var canvasbg = document.querySelector("#background");
var c = canvasbg.getContext("2d");
let bg_img = new Image();
bg_img.src = "bgimg.jpg";
bg_img.addEventListener("load", function () {
    c.drawImage(bg_img, -50, 0, 350 + canvasbg.width, canvasbg.height)
})

let canvas = document.querySelector("#canvas");
let screen = canvas.getContext("2d");

let continue_ = false;
let update_y = true;
let pre = Date.now();
let pre2 = Date.now();
let prev_key = null;
let single_press = true;
let score = 0;

function restart() {
    tilemap.restart();

    continue_ = false;
    update_y = true;
    pre = Date.now();
    pre2 = Date.now();
    prev_key = null;
    single_press = true;
    score = 0;
}

restart();

function get_events() {
    single_press = false;
    window.addEventListener("keydown", function (e) {
        if (prev_key === null && e.code !== null) {
            single_press = true;
        }
        if (single_press) {
            if (e.code === "ArrowLeft") {
                tilemap.tetrominos[0].moveLeft();
            } else if (e.code === "ArrowRight") {
                tilemap.tetrominos[0].moveRight();
            } else if (e.code === "ArrowDown") {
                tilemap.tetrominos[0].moveDown();
            } else if (e.code === "ArrowUp") {
                tilemap.tetrominos[0].Rotate();
            }
            // tilemap.tetrominos[0].update_movement();
            continue_ = true;
            update_y = false;
            tilemap.tetrominos[0].can_go_down = false;
            draw();
        }
    });
}

function draw() {
    screen.clearRect(0, 0, canvas.width, canvas.height);
    tilemap.draw(screen);
}

function update() {
    // console.log(tilemap.tetrominos[0].can_go_down);
    return tilemap.update(update_y);
}

draw();

function main() {
    requestAnimationFrame(main);

    if (!tilemap.lose) {    
        let curr = Date.now();
        if (curr - pre2 > 100) {
            pre2 = curr;
            if (curr - pre > 1000) {
                tilemap.tetrominos[0].y++;
                continue_ = true;
                pre = curr;
            }
            if (continue_) {
                continue_ = false;

                // screen.clearRect(0, 0, canvas.width, canvas.height);
                update_y = true;
                get_events();
                tilemap.tetrominos[0].can_go_down = true;
                let v = update();
                draw();
                // console.log(v);
                if (v) {
                    score++;
                    console.log("Scored");
                }

                document.querySelector("#score").textContent = String(score);
            }
        }
    } else {
        screen.fillStyle = "black";
        screen.font = "32px Ariel";
        screen.textAlign = "center";
        screen.fillText("Game over!", canvas.width / 2, 100);
        screen.font = "24px Ariel";
        screen.fillText("Refresh to page to try again.", canvas.width / 2, 130);
    }
}

main();
