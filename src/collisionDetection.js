export const detectCollision = (ball, gameObjects) => {

    let bottomOfBall = ball.position.y + ball.size;
    let topOfBall = ball.position.y;
    let topOfGameObject = gameObjects.position.y;
    let leftSideOfGameObject = gameObjects.position.x;
    let rightSideOfGameObject = gameObjects.position.x + gameObjects.w;
    let bottomOfGameObject = gameObjects.position.y + gameObjects.h;
    if(
        bottomOfBall >= topOfGameObject &&
        topOfBall <= bottomOfGameObject &&
        ball.position.x >= leftSideOfGameObject &&
        ball.position.x + ball.size <= rightSideOfGameObject
    ){
        return true;
    } else {
        return false;
    }
}