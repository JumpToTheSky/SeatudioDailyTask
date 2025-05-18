import { MiniGameEngine, Sprite, Button } from './engine/index';

const engine = new MiniGameEngine('gameCanvas');
const canvas = engine.getCanvas();

const redSquare = new Sprite({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    color: 'red'
});
engine.add(redSquare);

const playerSprite = new Sprite({
    x: 200,
    y: 150,
    width: 64,
    height: 64,
    imageSrc: 'https://via.placeholder.com/64/0000FF/FFFFFF?Text=Player'
});
engine.add(playerSprite);

let score = 0;
const myButton = new Button({
    x: canvas.width / 2 - 75,
    y: canvas.height - 100,
    width: 150,
    height: 50,
    text: 'Click Me!',
    color: 'green',
    textColor: 'white',
    font: '20px Arial',
    onClick: () => {
        score++;
        console.log('Button clicked! Score:', score);
        redSquare.x += 10;
        if (redSquare.x > canvas.width) {
            redSquare.x = -redSquare.width;
        }
        myButton.text = `Score: ${score}`;
    }
});
engine.add(myButton);

let playerSpeed = 100;
playerSprite.update = (deltaTime: number) => {
    playerSprite.x += playerSpeed * deltaTime;
    if (playerSprite.x > canvas.width) {
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
engine.add(blueCircle);


engine.start();