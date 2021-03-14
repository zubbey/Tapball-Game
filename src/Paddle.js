class Paddle {
    constructor (game) {
        this.gameWidth = game.canvas.width;
        this.gameHeight = game.canvas.height;
        this.w = 180;
        this.h = 20;
        this.speed = 0;
        this.maxSpeed = 6;
        this.position = {
            x: this.gameWidth / 2 - this.w / 2,
            y: this.gameHeight - this.h - 10
        }
    }
    
    
    draw(ctx) {
        ctx.fillStyle = 'white';
        // ctx.lineCap = 'round';
        ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
    }

    update(deltaTime) {
        // if(!deltaTime) return;
        this.position.x += this.speed;

        if(this.position.x < 0) this.position.x = 0;
        
        if(this.position.x + this.w > this.gameWidth) this.position.x = this.gameWidth - this.w;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }
    stop() {
        this.speed = 0;
    }
}

export default Paddle;