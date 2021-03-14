import Enemy from "./Enemy.js";

export const buildLevel = (game, images, level) => {
    let enemies = [];


    level.forEach((row, rowindex) => {
        row.forEach((enemy, enemyIndex) => {
            if(enemy) {
                let position = {
                    x: 80 * enemyIndex,
                    y: 20 + 80 * rowindex
                };
                enemies.push(new Enemy(game, getRandomImage(images), position))
            }
        })
    })

    return enemies;
}

const getRandomImage = (images) => {
    let image = '';
    for(let i=0; i<images.length; i++) {
        let randomIndex = Math.floor(Math.random() * 4);
        image = images[randomIndex];
    }
    return image;
}

export const level1 = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
]

export const level2 = [
    [1, 1, 1, 0, 0, 1, 0, 0, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
]

export const level3 = [
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
]

export const level4 = [
    [0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 1, 1, 0],
    [1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 0, 0, 1, 1, 0]
]