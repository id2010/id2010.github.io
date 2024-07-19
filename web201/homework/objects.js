function rectPointCollision(point, rect) {
    if (point[0] >= rect[0] && point[0] <= rect[0] + rect[2] && point[1] >= rect[1] && point[1] <= rect[1] + rect[3]) {
        return true;
    }
    return false;
}

function circleRectCollision(c, r) {
    // Circle [x, y, r]
    // Rect   [x, y, w, h]
    let closest_x = Math.max(r[0], Math.min(c[0], r[0] + r[2]));
    let closest_y = Math.max(r[1], Math.min(c[1], r[1] + r[3]));
    let dis_x = c[0] - closest_x;
    let dis_y = c[1] - closest_y;

    // console.log((dis_x ** 2 + dis_y ** 2) <= (c[2] ** 2));
    return (dis_x ** 2 + dis_y ** 2) <= (c[2] ** 2);
}

const maxAngle = 160;
const minAngle = 20;

let color_theme = "white";

let bounce = new Audio("./bounce.mp3");
bounce.volume = 0.2;

export function bounce_sound() {
    let bounce_clone = bounce.cloneNode();
    bounce_clone.play();
}

export class Brick {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 20;
        this.right = this.x + this.w;
        this.bottom = this.y + this.h;
        this.die = false;
    }

    draw() {
        screen.beginPath();
        screen.fillStyle = color_theme;
        screen.rect(this.x, this.y, this.w, this.h);
        screen.fill();
        screen.closePath();
    }

    update() {
        this.right = this.x + this.w;
        this.bottom = this.y + this.h;
    }
}

let keymap = {
    left: ["A", "a", "ArrowLeft"],
    right: ["D", "d", "ArrowRight"]
}

let paddle_properties = {
    y_offset: 20,
    width: 140,
    height: 20,
    color: color_theme
}

let ball_properties = {
    radius: 10,
    color: color_theme
}

let paddle = {
    ...paddle_properties,
    x: 600 / 2 - paddle_properties.width / 2,
    y: 600 - paddle_properties.height - paddle_properties.y_offset,
    update: function (dt, held_key) {
        if (keymap.left.includes(held_key)) {
            this.x -= 300 * dt;
        }
        else if (keymap.right.includes(held_key)) {
            this.x += 300 * dt;
        }

        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x + this.width > 600) {
            this.x = 600 - this.width;
        }
    }
}

let ball = {
    ...ball_properties,
    x: 600 / 2,
    y: paddle.y - ball_properties.radius,
    d_x: 200 * 2,
    d_y: 80 * 2,
    x_vel: 200 * 2,
    y_vel: 80 * 2,
    lose_life: false,
    signal_pause: false,
    add_point: false,
    update: function (dt, paddle, bricks) {
        this.lose_life = false;
        this.add_point = false;
        this.signal_pause = false;
        this.x -= this.x_vel * dt;
        this.y -= this.y_vel * dt;

        if (this.x - this.radius <= 0 || this.x + this.radius >= 600) {
            bounce_sound();
            this.x_vel = -this.x_vel;
        }
        else if (this.y - this.radius <= 0) {
            bounce_sound();
            this.y_vel = -this.y_vel;
        }
        else if (circleRectCollision([this.x, this.y, this.radius], [paddle.x, paddle.y, paddle.width, paddle.height])) {
            // this.y = paddle.y - this.radius;

            bounce_sound();
            let hitX = this.x - paddle.x;
            let angle = maxAngle - Math.floor((maxAngle - minAngle) / paddle.width * hitX);
            let energy = (this.d_x ** 2 + this.d_y ** 2) ** 0.5;
            this.x_vel = -(energy * Math.cos(angle * (Math.PI / 180)));
            this.y_vel = (energy * Math.sin(angle * (Math.PI / 180)));
        }
        else {
            for (let brick of bricks) {
                if (circleRectCollision([this.x, this.y, this.radius], [brick.x, brick.y, brick.w, brick.h])) {
                    bounce_sound();
                    brick.die = true;
                    console.log("brick destroyed");
                    this.add_point = true;

                    if (this.x > brick.x && this.x < brick.right) {
                        this.y_vel = -this.y_vel;
                    } else {
                        this.x_vel = -this.x_vel;
                    }
                }
            }
        }

        if (!rectPointCollision([this.x, this.y], [-10, -10, 600 + 10, 600 + 10])) {
            this.x = 600 / 2;
            this.y = paddle.y - ball_properties.radius;
            this.x_vel = 200 * 2;
            this.y_vel = 80 * 2;
            paddle.x = 600 / 2 - paddle.width / 2
            console.log("Ball out of bounds. Ball reset.");
            this.lose_life = true;
            this.signal_pause = true;
        }
    }
}
let paddle_copy = {
    ...paddle
}

let ball_copy = {
    ...ball
}


export { paddle, ball, color_theme, bounce, keymap, paddle_copy, ball_copy };
