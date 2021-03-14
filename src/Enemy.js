import { detectCollision } from "./collisionDetection.js";

class Enemy {
    constructor(game, image, position) {
        this.game = game;
        this.gameWidth = game.canvas.width;
        this.gameHeight = game.canvas.height;
        this.ball = game.ball;
        this.image = image;
        this.w = 80;
        this.h = 80;
        this.speed = Math.floor(Math.random() * 4) + 1;
        this.maxSpeed = 5;
        this.position = position;
        this.eliminated = false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
    }

    async update(deltaTime) {
        this.position.y += this.speed / deltaTime;

        if(this.position.y + this.h > this.gameHeight) {
            this.game.lives -= 1;
            this.ball.reset();
        }
        try {
            
            if(detectCollision(this.ball, this)) {
                this.ball.speed.y = -this.ball.speed.y;
    
                this.game.scores.enemiesKilled.push(this);
                await this.game.destroyedSound.play();
                
                this.eliminated = true;
            }
            // if(detectCollision(this, this)) {
            //     console.log('touched each other!');
            // }
        } catch (error) {
            alert(error?.message);
        }
    }
}

export default Enemy;