import { Z, O, I, J, L, S, T } from "./patterns.js";

export let Tetromino = {
    x: 2 + 1,
    y: 1,
    tilesize: 30,
    shape: {...Z},
    shape_width: Z[0][0].length,
    shape_height: Z[0].length,
    phase: 3,
    max_phase: 0,
    color: "red",
    fillcolor: "pink",
    draw: function (screen) {
        let current = this.shape[this.phase];

        screen.beginPath();
        for (let r = 0; r < this.shape_height; r++) {
            for (let c = 0; c < this.shape_width; c++) {
                if (current[r][c] === 1) {
                    screen.rect(this.x * this.tilesize + c * this.tilesize, this.y * this.tilesize + r * this.tilesize, this.tilesize, this.tilesize);
                    screen.fillStyle = this.fillcolor;
                    screen.fill();
                    screen.strokeStyle = this.color;
                    screen.stroke();

                    console.log("Drew tetromino");
                }
            }
        }
        screen.closePath();
    },
    update: function () {
        this.max_phase = this.shape[this.phase].length;
        
        // this.phase++;
        
        if (this.phase > this.max_phase) {
            this.phase = 0;
        }
    }
}

export let tilemap = {
    width: 10,
    height: 20,
    size: 30,
    tetrominos: [{...Tetromino}],
    squares: [],
    get_squares: (function () {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                let s = { ...square };
                s.x = c * s.w;
                s.y = r * s.h;
                this.squares.push(s);
            }
        }
    }),

    draw: function (screen) {
        screen.beginPath();
        screen.strokeStyle = "skyblue";
        this.squares.forEach(e => {
            screen.rect(e.x, e.y, e.w, e.h);
            screen.stroke();
        });
        screen.closePath();

        this.tetrominos.forEach(tetromino => {
            tetromino.draw(screen);
        });
    },
    update: function () {
        this.tetrominos.forEach(tetromino => {
            tetromino.update();
        });
    }
}

export let square = {
    x: 0,
    y: 0,
    w: tilemap.size,
    h: tilemap.size,
    draw: function (screen) {
        screen.beginPath();
        screen.rect(this.x * this.w, this.y * this.h, this.w, this.h);
        screen.strokeStyle = "black";
        screen.stroke();
        screen.closePath();
    },
    update: function () {

    }
}
