import { square, tilemap } from "./blocks.js";

let canvas = document.querySelector("#canvas");
let screen = canvas.getContext("2d");

tilemap.get_squares();

let continue_ = false;
let update_y = true;
let pre = Date.now();
let prev_key = null;
let single_press = true;

function get_events() {
    single_press = false;
    tilemap.tetrominos[0].can_go_down = true;
    window.addEventListener("keydown", function(e) {
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
            // console.log("set update_y to false")
            screen.clearRect(0, 0, canvas.width, canvas.height);
            draw();
        }
    });
}

function draw() {
    tilemap.draw(screen);
}

function update() {
    console.log(tilemap.tetrominos[0].can_go_down);
    tilemap.update(update_y);
}

function main() {
    requestAnimationFrame(main);
    
    draw();
    
    let curr = Date.now();
    if (curr - pre > 1000) {
        continue_ = true;
    }
    if (continue_) {
        continue_ = false;
        pre = curr;

        screen.clearRect(0, 0, canvas.width, canvas.height);
        update_y = true;
        get_events();
        update();
    }
}

main();
