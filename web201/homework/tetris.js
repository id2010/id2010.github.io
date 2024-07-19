import { square, tilemap } from "./blocks.js";

let canvas = document.querySelector("#canvas");
let screen = canvas.getContext("2d");

tilemap.get_squares();

function get_events() {

}

function draw() {
    tilemap.draw(screen);

    // square.draw(screen);
}

function update() {
    tilemap.update();
}

function main() {
    screen.clearRect(0, 0, canvas.width, canvas.height);

    get_events();
    update();
    draw();

    // square.y++;

    requestAnimationFrame(main);
}

main();
