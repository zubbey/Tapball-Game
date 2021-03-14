
class InputHandler {
    constructor(game) {
        addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight' || 'Right':
                    game.paddle.moveRight();
                    break;

                case 'ArrowLeft' || 'Left':
                    game.paddle.moveLeft();
                    break;

                case 'Escape':
                    game.togglePause();
                    break;

                case ' ':
                    game.start();
                    break;

                default:
                    break;
            }
        })
        addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowRight' || 'Right':
                    if(game.paddle.speed > 0) game.paddle.stop();
                    break;

                case 'ArrowLeft' || 'Left':
                    if(game.paddle.speed < 0) game.paddle.stop();
                    break;

                default:
                    break;
            }
        })
    }
}

export default InputHandler;