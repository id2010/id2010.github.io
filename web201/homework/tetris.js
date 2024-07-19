import { square } from "./blocks.js";

let canvas = document.querySelector("#canvas");
let screen = canvas.getContext("2d");

function get_events() {

}

function draw() {
    square.draw(screen);
}

function update() {

}

function main() {
    screen.clearRect(0, 0, canvas.width, canvas.height);

    get_events();
    update();
    draw();

    square.y++;

    requestAnimationFrame(main);
}

main();
