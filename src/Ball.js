import { detectCollision } from "./collisionDetection.js";

class Ball {
    constructor (game) {
        this.game = game;
        this.gameWidth = game.canvas.width;
        this.gameHeight = game.canvas.height;
        this.paddle = game.paddle;
        this.size = 12;

        this.reset();
    }

    reset() {
        this.speed = {x: 4, y: 4};
        this.position = {
            x: this.gameWidth  / 2,
            y: this.gameHeight - this.size - this.game.paddle.h - 10
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6347';
        ctx.fill();
    }

    async update(deltaTime){
        this.position.x += this.speed.x;
        this.position.y -= this.speed.y;

        if(this.position.x + this.size > this.gameWidth || this.position.x - this.size < 0){
            this.speed.x = -this.speed.x
        }
        if(this.position.y - this.size < 0){
            this.speed.y = -this.speed.y
        }
        //hit the bottom
        if(this.position.y + this.size > this.gameHeight) {
            this.speed.y = -this.speed.y;

            this.game.lives -= 1;
            this.reset();
            // return;
        }
         try {
             //Detect Paddle
             if(detectCollision(this, this.paddle)){
                 this.speed.y = -this.speed.y;
                 this.position.y = this.paddle.position.y - this.size;
                 this.game.tapSound.play();
             }
         } catch (error) {
            alert(error?.message);
         }
    }
}

export default Ball;