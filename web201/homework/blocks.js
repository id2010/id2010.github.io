import { Z, O, I, J, L, S, T } from "./patterns.js";

export let Tetromino = {
    x: 2 + 1,
    y: 1,
    tilesize: 30,
    shape: {...Z.patterns},
    shape_size: Z.size,
    phase: 3,
    max_phase: 0,
    color: Z.color,
    fillcolor: Z.fillcolor,
    draw: function (screen) {
        let current = this.shape[this.phase];
        
        let newx = this.x * this.tilesize;
        let newy = this.y * this.tilesize;
        let neww = this.shape_size * this.tilesize
        let newh = this.shape_size * this.tilesize
        console.log(newx, newy, neww, newh);
        screen.beginPath();
        screen.lineWidth = 2;
        screen.strokeStyle = "green";
        screen.rect(newx, newy, neww, newh);
        screen.stroke();
        screen.closePath();

        screen.beginPath();
        for (let r = 0; r < this.shape_size; r++) {
            for (let c = 0; c < this.shape_size; c++) {
                if (current[r][c] === 1) {
                    screen.rect(this.x * this.tilesize + c * this.tilesize, this.y * this.tilesize + r * this.tilesize, this.tilesize, this.tilesize);
                    screen.fillStyle = this.fillcolor;
                    screen.fill();
                    screen.strokeStyle = this.color;
                    screen.stroke();

                    // console.log("Drew tetromino");
                }
            }
        }
        screen.closePath();
    },
    update: function () {
        this.max_phase = this.shape[this.phase].length;
        
        // this.phase++;
        // 
        
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
