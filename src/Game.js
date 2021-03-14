import Paddle from "./Paddle.js";
import Ball from "./Ball.js";
import InputHandler from "./InputHandler.js";
import { buildLevel, level1, level2, level3, level4 } from "./level.js";

const GAMESTATE = {
    PAUSE: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 4,
    NEWLEVEL: 5,
    COMPLETED: 6
}

class Game {
    constructor() {
        const app = document.querySelector('#app');
        const gameTitle = document.createElement('img');
        const startGameButton = document.createElement('button');

        gameTitle.setAttribute('src', '../assets/tapball.png');
        startGameButton.setAttribute('id', 'startButton');
        startGameButton.textContent = 'START GAME';

        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');
        canvas.width = 800;
        canvas.height = 600;

        this.app = app;
        this.gameTitle = gameTitle;
        this.startGameButton = startGameButton;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.app.append(this.canvas);
        this.app.appendChild(this.enemyImages());

        this.gameState = GAMESTATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        new InputHandler(this);

        this.gameObjects = [];
        this.lives = 3;
        this.enemies = [];
        this.levels = [level1, level2, level3, level4];
        this.currentLevel = 0;
        this.levelDisplay = 1;
        this.scores = {
            enemiesKilled: [],
            totalLevels: 0
        }
        this.tapSound = new Audio('./assets/audio/tap.wav');
        this.destroyedSound = new Audio('./assets/audio/destroy.wav');
        this.soundTrack = new Audio('./assets/audio/soundtrack.ogg');
        this.gameMenu();
    };

    start() {
        if(
            this.gameState !== GAMESTATE.MENU &&
            this.gameState !== GAMESTATE.NEWLEVEL &&
            this.gameState !== GAMESTATE.COMPLETED &&
            this.gameState !== GAMESTATE.GAMEOVER
        ) return;
        
        this.soundTrack.volume = 0.70;
        this.soundTrack.loop = true;
        this.soundTrack.play();
        if(this.lives < 2) this.lives = 3;

        const imageList = document.querySelector('#imageList');
        const images = imageList.querySelectorAll('.image');

        this.enemies = buildLevel(this, images, this.levels[this.currentLevel]);
        this.ball.reset();

        this.gameObjects = [this.paddle, this.ball];

        this.gameState = GAMESTATE.RUNNING;

        if(this.startGameButton) {
            this.startGameButton.remove();
    
            this.app.appendChild(this.stateHeader());
            const pauseButton = document.querySelector('#controls');
    
            pauseButton.addEventListener('click', (e) => this.togglePause());
        }
    }

    draw() {
        [...this.gameObjects, ...this.enemies].forEach(object => {
            object.draw(this.ctx);
        })
        if(this.gameState === GAMESTATE.RUNNING) {
            const lives = document.querySelector('#lives');
            const level = document.querySelector('#levels');
            lives.innerHTML = `&hearts; ${this.lives}`;
            
            level.textContent = `Level ${this.levelDisplay}`;

        }else if(this.gameState === GAMESTATE.PAUSE) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = '30px sans-serif';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '18px sans-serif';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('press SPACEBAR to continue', this.canvas.width / 2, (this.canvas.height + 80) / 2);

        } else if(this.gameState === GAMESTATE.GAMEOVER) {
            this.gameMenu();
            this.soundTrack.pause();
            

            this.ctx.fillStyle = 'rgba(0, 0, 0, .9)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = '30px sans-serif';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '18px sans-serif';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Destroyed ${this.scores.enemiesKilled.length.toString()} Enemies`, this.canvas.width / 2, (this.canvas.height + 60) / 2);
            let stateContainer = document.querySelector('#stateContainer');
            if(stateContainer) stateContainer.remove();

            this.currentLevel = 0;
            this.levelDisplay = 1;
            
            let startButton = document.querySelector('#startButton');
            startButton.textContent = 'RESTART';
            startButton.addEventListener('click', () => {
                this.scores.enemiesKilled = [];
                this.start();
            })

        } else if(this.gameState === GAMESTATE.MENU) {
            this.ctx.fillStyle = '#1e223e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.gameTitle, (this.canvas.width - 258) / 2, this.canvas.height / 2.5 - 80, 258, 154);
        } else if (this.gameState === GAMESTATE.COMPLETED) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, .9)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = '30px sans-serif';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME COMPLETED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '18px sans-serif';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Congratulation! you have completed the game.', this.canvas.width / 2, (this.canvas.height + 80) / 2);
            let stateContainer = document.querySelector('#stateContainer');
            if(stateContainer) stateContainer.remove();
        }
    }

    update(deltaTime) {
        if(this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;
        if(
            this.gameState === GAMESTATE.PAUSE ||
            this.gameState === GAMESTATE.MENU ||
            this.gameState === GAMESTATE.GAMEOVER ||
            this.gameState === GAMESTATE.COMPLETED
        ) return;

        //Load new level if all enemies are destroyed
        if(this.enemies.length === 0) {
            if(this.currentLevel >= 3) {
                this.gameState = GAMESTATE.COMPLETED;
                this.endGame();
            } else {
                this.currentLevel += 1;
                this.levelDisplay += 1;
                this.gameState = GAMESTATE.NEWLEVEL;
                this.start();
            }
        }

        [...this.gameObjects, ...this.enemies].forEach(object => {
            object.update(deltaTime);
        })

        this.enemies = this.enemies.filter(enemie => !enemie.eliminated)
    }

    togglePause() {
        if(this.gameState === GAMESTATE.PAUSE) this.gameState = GAMESTATE.RUNNING;
        else this.gameState = GAMESTATE.PAUSE;
    }

    gameMenu() {
        if(this.gameState === GAMESTATE.MENU || this.gameState === GAMESTATE.GAMEOVER) {
            if(this.app.contains(document.querySelector('#startButton')) === false) {
                this.app.appendChild(this.startGameButton);
                this.startGameButton.addEventListener('click', (e) => {
                    this.start();
                });
            }
        }
    }

    stateHeader() {
        let container = document.createElement('div');
        let lives = document.createElement('div');
        let levels = document.createElement('p');
        let controls = document.createElement('button');

        container.setAttribute('id', 'stateContainer')
        lives.setAttribute('id', 'lives');
        controls.setAttribute('id', 'controls');
        levels.setAttribute('id', 'levels')

        controls.innerHTML = '&#9612;&#9612;';
        container.appendChild(lives)
        container.appendChild(controls)
        container.appendChild(levels)

        return container;
    }

    enemyImages() {
        let imagesContainer = document.createElement('div');
        imagesContainer.setAttribute('id', 'imageList');

        for(let i=0; i<5; i++) {
            let rock = 'rock' + i;
            rock = document.createElement('img');
            rock.setAttribute('class', 'image');
            rock.setAttribute('src', `../assets/rock${i}.png`);
            imagesContainer.appendChild(eval(rock));
        }

        return imagesContainer;
    }

    endGame() {
        setTimeout(() => {
            this.soundTrack.pause();

            location.reload();
        }, 2000);
    }
}

export default Game;