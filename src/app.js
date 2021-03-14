import Game from "./Game.js";

(() => {
    const game = new Game();
    // game.start();

    let lastTime = 0;

    const gameLoop = (timestamp) => {
        let daltaTime = timestamp - lastTime;
        lastTime = timestamp;

        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.update(daltaTime);
        game.draw();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
})()