import { MiniGameEngine, Sprite, Button } from './engine/index.js';
const gameEngine = new MiniGameEngine('gameCanvas');
const canvasElement = gameEngine.getCanvasElement();
const redSquare = new Sprite({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    color: 'red'
});
gameEngine.addGameObject(redSquare);
const playerSprite = new Sprite({
    x: 200,
    y: 150,
    width: 64,
    height: 64,
    imageSrc: 'https://via.placeholder.com/64/0000FF/FFFFFF?Text=Player'
});
gameEngine.addGameObject(playerSprite);
let currentScore = 0;
const myButton = new Button({
    x: canvasElement.width / 2 - 75,
    y: canvasElement.height - 100,
    width: 150,
    height: 50,
    text: 'Click Me!',
    color: 'green',
    textColor: 'white',
    font: '20px Arial',
    onClick: () => {
        currentScore++;
        console.log('Button clicked! Score:', currentScore);
        redSquare.x += 10;
        if (redSquare.x > canvasElement.width) {
            redSquare.x = -redSquare.width;
        }
        myButton.text = `Score: ${currentScore}`;
    }
});
gameEngine.addGameObject(myButton);
let playerMovementSpeed = 100;
playerSprite.update = (deltaTime) => {
    playerSprite.x += playerMovementSpeed * deltaTime;
    if (playerSprite.x > canvasElement.width) {
        playerSprite.x = -playerSprite.width;
    }
};
const blueCircle = new Sprite({
    x: 70,
    y: 70,
    width: 50,
    height: 50,
    color: 'blue'
});
gameEngine.addGameObject(blueCircle);
gameEngine.start();
//# sourceMappingURL=game.js.map