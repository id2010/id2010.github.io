import { Z, O, I, J, L, S, T, all_tetriminos } from "./patterns.js";

export class Tetromino {
    constructor(shape_, x, y) {
        this.x = x;
        this.y = y - 1;
        this.tilesize = 30;
        this.shape_ = { ...shape_ };
        this.phase = 0;
        this.moveleft = false;
        this.moveright = false;
        this.movedown = false;
        this.rotate = false;
        this.can_go_down = true;
        this.dead = false;
        this.reset_shape();
    }

    reset_shape() {
        this.shape = { ...this.shape_.patterns };
        this.shape_size = this.shape_.size;
        this.max_phase = this.shape_.patterns.length - 1;
        this.color = this.shape_.color;
        this.fillcolor = this.shape_.fillcolor;
    }

    reset() {
        this.y = 0;
        this.x = 3;
        this.dead = false;

        for (let i = 0; i < 1; i++) {
            let random_shape = Math.floor(Math.random(0, 6) * 6);
            // let random_shape = Math.floor(Math.random(0, 7) * 7);
            // console.log(all_tetriminos.length);
            // console.log(random_shape);
            this.shape_ = { ...all_tetriminos[random_shape] };
            this.reset_shape();
        }
    }

    draw(screen) {
        let current = this.shape[this.phase];

        let newx = this.x * this.tilesize;
        let newy = this.y * this.tilesize;
        let neww = this.shape_size * this.tilesize
        let newh = this.shape_size * this.tilesize
        screen.beginPath();
        screen.lineWidth = 2;
        screen.strokeStyle = "green";
        screen.rect(newx, newy, neww, newh);
        screen.stroke();
        screen.closePath();

        screen.beginPath();
        for (let r = 0; r < this.shape_size; r++) {
            for (let c = 0; c < this.shape_size; c++) {
                // console.log(current)
                if (current[r][c] === 1) {
                    screen.rect(this.x * this.tilesize + c * this.tilesize, this.y * this.tilesize + r * this.tilesize, this.tilesize, this.tilesize);
                    screen.lineWidth = 4;
                    screen.strokeStyle = this.color;
                    screen.stroke();
                    screen.fillStyle = this.fillcolor;
                    screen.fill();
                    screen.lineWidth = 1;
                    screen.stroke();
                }
            }
        }
        screen.closePath();
    }

    update_movement() {
        if (this.moveleft) {
            this.x--;
            this.moveleft = false;
        } else if (this.moveright) {
            this.x++;
            this.moveright = false;
        } else if (this.movedown) {
            this.y++;
            this.movedown = false;
        } else if (this.rotate) {
            this.phase++;
            this.rotate = false;
        }
    }

    update(move_down, tm) { // tm = tilemap
        this.update_movement();

        if (this.can_go_down) {
            this.y++;
        }

        if (this.phase > this.max_phase || this.phase < 0) {
            this.phase = 0;
        }

        let current = this.shape[this.phase];
        for (let r = 0; r < this.shape_size; r++) {
            for (let c = 0; c < this.shape_size; c++) {
                let rr = this.y + r;
                let cc = this.x + c;
                if (current[r][c] === 1) {
                    if (rr >= 20) {
                        this.y--;
                        this.dead = true;
                        break
                    } else if (cc < 0) {
                        this.x++;
                        break
                    } else if (cc >= 10) {
                        this.x--;
                        break
                    }
                }
            }
        } // collision. if collide then go up by 1 and die
        for (let r = 0; r < this.shape_size; r++) {
            for (let c = 0; c < this.shape_size; c++) {
                let rr = this.y + r;
                let cc = this.x + c;
                if (current[r][c] === 1) {
                    if (tm[rr][cc].color !== "none") {
                        this.y--;
                        this.dead = true;
                        return;
                    }
                }
            }
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
    tetrominos: [new Tetromino(Z, 3, 0)],
    squares_: [],
    squares: [],
    get_squares: (function () {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                let s = { ...square };
                s.x = c * s.w;
                s.y = r * s.h;
                this.squares_.push(s);
            }
        }
        for (let r = 0; r < this.height; r++) {
            this.squares.push([]);
            for (let c = 0; c < this.width; c++) {
                this.squares[r].push({ ...stamped_square });
            }
        }
    }),

    draw: function (screen) {
        screen.beginPath();
        screen.strokeStyle = "skyblue";
        this.squares_.forEach(e => {
            screen.rect(e.x, e.y, e.w, e.h);
            screen.stroke();
        });
        screen.closePath();
        
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                if (this.squares[r][c].color !== "none") {
                    screen.beginPath();
                    screen.rect(c * 30, r * 30, 30, 30);
                    screen.strokeStyle = this.squares[r][c].color;
                    screen.fillStyle = this.squares[r][c].fillcolor;
                    screen.fill();
                    screen.stroke();
                    screen.closePath();
                }
            }
        }

        this.tetrominos.forEach(tetromino => {
            tetromino.draw(screen);
        });
    },
    update: function (move_down) {
        this.tetrominos.forEach(tetromino => {
            tetromino.update(move_down, this.squares);
            if (tetromino.dead) {                
                let current = tetromino.shape[tetromino.phase];
                for (let r = 0; r < tetromino.shape_size; r++) {
                    for (let c = 0; c < tetromino.shape_size; c++) {
                        let rr = tetromino.y + r;
                        let cc = tetromino.x + c;
                        if (current[r][c] === 1) {
                            this.squares[rr][cc].color = tetromino.color;
                            this.squares[rr][cc].fillcolor = tetromino.fillcolor;
                        }
                    }
                }
                tetromino.reset();
            }
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

export let stamped_square = {
    "color": "none",
    "fillcolor": "none"
}
