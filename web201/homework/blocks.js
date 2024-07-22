import { Z, O, I, J, L, S, T } from "./patterns.js";

export class Tetromino {
    constructor(shape_, x, y) {
        this.x = x;
        this.y = y - 1;
        this.tilesize = 30;
        this.shape = {...shape_.patterns};
        this.shape_size = shape_.size;
        this.phase = 0;
        this.max_phase = 0;
        this.color = shape_.color;
        this.fillcolor = shape_.fillcolor;
        this.moveleft = false;
        this.moveright = false;
        this.movedown = false;
        this.rotate = false;
    }

    draw(screen) {
        let current = this.shape[this.phase];
        
        let newx = this.x * this.tilesize;
        let newy = this.y * this.tilesize;
        let neww = this.shape_size * this.tilesize
        let newh = this.shape_size * this.tilesize
        // console.log(newx, newy, neww, newh);
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
                    screen.lineWidth = 4;
                    screen.strokeStyle = this.color;
                    screen.stroke();
                    screen.fillStyle = this.fillcolor;
                    screen.fill();
                    screen.lineWidth = 1;
                    screen.stroke();

                    // console.log("Drew tetromino");
                }
            }
        }
        screen.closePath();
    }

    update_movement() {
        if (this.moveleft) {
            this.x--;
            this.moveleft = false;
            // this.update(move_down = false)
        } else if (this.moveright) {
            this.x++;
            this.moveright = false;
            // this.update(move_down = false)
        } else if (this.movedown) {
            this.y++;
            this.movedown = false;
            // this.update(move_down = false)
        } else if (this.rotate) {
            this.phase++;
            this.rotate = false;
            // this.update(move_down = false)
        }
    }

    update(move_down = true) {
        this.max_phase = this.shape[this.phase].length;

        if (move_down) {
            this.y++;
        }
        this.update_movement();
        
        if (this.phase > this.max_phase || this.phase < 0) {
            this.phase = 0;
        }
    }

    moveLeft() {
        this.moveleft = true;
    }

    moveRight() {
        this.moveright = true;
    }
    
    moveDown() {
        this.movedown = true;
    }
    
    Rotate() {
        this.rotate = true;
    }
}

export let tilemap = {
    width: 10,
    height: 20,
    size: 30,
    tetrominos: [new Tetromino(Z, 2, 0)],
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
