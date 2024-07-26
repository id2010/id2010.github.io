import { Z, O, I, J, L, S, T, all_tetriminos } from "./patterns.js";

export class Tetromino {
    constructor(shape_, x, y) {
        this.reset();
        // this.x = x;
        // this.y = y - 1;
        this.tilesize = 30;
        this.shape_ = { ...shape_ };
        this.phase = 0;
        this.moveleft = false;
        this.moveright = false;
        this.movedown = false;
        this.rotate = false;
        this.can_go_down = true;
        this.dead = false;
        // this.reset_shape();
    }

    reset_shape() {
        this.shape = { ...this.shape_.patterns };
        this.shape_size = this.shape_.size;
        this.max_phase = this.shape_.patterns.length - 1;
        this.color = this.shape_.color;
        this.fillcolor = this.shape_.fillcolor;
    }

    reset() {
        this.y = -3;
        this.x = 3;
        this.dead = false;
        let repick = true;

        while (true) {
            // let random_shape = Math.floor(Math.random(0, 6) * 6);
            let random_shape = Math.floor(Math.random(0, 7) * 7);
            // console.log(all_tetriminos.length);
            // console.log(random_shape);
            this.shape_ = { ...all_tetriminos[random_shape] };
            // this.shape_ = { ...all_tetriminos[0] };
            this.reset_shape();

            repick = true;
            let current = this.shape[this.phase];
            for (let r = 0; r < this.shape_size; r++) {
                for (let c = 0; c < this.shape_size; c++) {
                    if (current === 1) {
                        repick = false;
                        break;
                    }
                    if (!repick) {
                        break;
                    }
                }
            }
            if (!repick) {
                break;
            }
            break;
        }
    }

    reset_phase() {
        if (this.phase > this.max_phase || this.phase < 0) {
            this.phase = 0;
        }
    }

    draw(screen) {
        let current = this.shape[this.phase];

        let newx = this.x * this.tilesize;
        let newy = this.y * this.tilesize;
        let neww = this.shape_size * this.tilesize
        let newh = this.shape_size * this.tilesize
        // screen.beginPath();
        // screen.lineWidth = 2;
        // screen.strokeStyle = "green";
        // screen.rect(newx, newy, neww, newh);
        // screen.stroke();
        // screen.closePath();

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

    update_movement(tm) {
        if (this.moveleft) {
            this.x--;
            this.moveleft = false;
            // this.y--;
        } else if (this.moveright) {
            this.x++;
            this.moveright = false;
            // this.y--;
        } else if (this.movedown) {
            this.y++;
            this.movedown = false;
            // this.y--;
        }
    }

    update(move_down, tm) { // tm = tilemap
        this.update_movement(tm);

        // if (this.can_go_down) {
        // this.y++;
        // }

        if (this.rotate) {
            this.phase++;
            this.rotate = false;

            this.reset_phase();
            let current = this.shape[this.phase];


            let break_all = false;
            for (let r = 0; r < this.shape_size; r++) {
                for (let c = 0; c < this.shape_size; c++) {
                    let rr = this.y + r;
                    let cc = this.x + c;
                    if (current[r][c] === 1 || cc < 0 || cc > 19) {
                        if (tm[rr][cc].color !== "none") {
                            this.phase--;
                            break_all = true;
                            break;
                        }
                    }
                    if (break_all) {
                        break;
                    }
                }
            }
        }

        let current = this.shape[this.phase];
        let break_all = false;
        for (let r = 0; r < this.shape_size; r++) {
            for (let c = 0; c < this.shape_size; c++) {
                let rr = this.y + r;
                let cc = this.x + c;
                if (current[r][c] === 1) {
                    if (rr >= 20) {
                        this.y--;
                        this.dead = true;
                        break_all = true;
                        break;
                    } else if (cc < 0) {
                        this.x++;
                        break_all = true;
                        break;
                    } else if (cc >= 10) {
                        this.x--;
                        break_all = true;
                        break;
                    }
                }
            }
            if (break_all) {
                break;
            }
        } // collision. if collide then go up by 1 and die
        for (let r = 0; r < this.shape_size; r++) {
            for (let c = 0; c < this.shape_size; c++) {
                let rr = this.y + r;
                let cc = this.x + c;
                if (current[r][c] === 1) {
                    // console.log(tilemap.squares[rr][cc].color)
                    if (this.y > 0) {
                        if (tilemap.squares[rr][cc].color !== "none") {
                            this.y--;
                            this.reset_phase();
                            this.dead = true;
                            return;
                        }
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
    lose: false,
    width: 10,
    height: 20,
    size: 30,
    tetrominos: [new Tetromino(Z, 3, 0)],
    squares_: [],
    squares: [],

    restart: function () {
        this.lose = false;
        this.width = 10;
        this.height = 20;
        this.size = 30;
        this.tetrominos = [new Tetromino(Z, 3, 0)];
        this.squares_ = [];
        this.squares = [];
        this.get_squares();
    },

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
        // screen.beginPath();
        // screen.strokeStyle = "skyblue";
        // this.squares_.forEach(e => {
        //     screen.rect(e.x, e.y, e.w, e.h);
        //     screen.stroke();
        // });
        // screen.closePath();

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
        let score_point = false;
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

        let all_0s = true;
        for (let c = 0; c < 10; c++) {
            let Color = this.squares[3][c].color
            if (Color !== "none") {
                all_0s = false;
            }
        }
        if (!all_0s) {
            this.lose = true;
        }

        // See rows
        let all_1s = true;
        for (let r = 19; r >= 0; r--) {
            all_1s = true;
            for (let c = 0; c < 10; c++) {
                // console.log(this.squares[r][c].color)
                let Color = this.squares[r][c].color
                if (Color === "none") {
                    all_1s = false;
                }
            }
            if (all_1s) {
                // score
                score_point = true;
                for (let rr = r; rr >= 1; rr--) {
                    this.squares[rr] = this.squares[rr - 1];
                }
            }
        }
        return score_point;
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
