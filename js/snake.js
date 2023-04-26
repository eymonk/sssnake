import { getRandomCanvasPosition } from './helpers.js';
import food, {eatFood} from './food.js';
import direction from './direction.js';
import { endGame } from './game.js';
import state, {
    dom,
    colors,
    changeScore
} from './state.js';


const snake = {
    body: [],
    increaseFactor: 1,
    maxIncreaseFactor: 4,
    initialLength: 5,
}

class snakePart {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}


function createNewSnake() {
    snake.body.length = 0;
    const random = getRandomCanvasPosition();
    for (let i = 0; i < snake.initialLength; i++) {
        snake.body.push(new snakePart(random.x, random.y));
    }
}


function moveSnake() {
    const head = snake.body[0];
    const unit = state.unit;

    passCoordinates(head.x, head.y, 1);

    if (direction.current === 'left') {
        head.x -= unit;
        if (head.x < 0) head.x = dom.canvas.width - unit;

    } else if (direction.current === 'right') {
        head.x += unit;
        if (head.x + unit > dom.canvas.width) head.x = 0;

    } else if (direction.current === 'up') {
        head.y -= unit;
        if (head.y < 0) head.y = dom.canvas.height - unit;

    } else if (direction.current === 'down') {
        head.y += unit;
        if (head.y + unit> dom.canvas.height) head.y = 0;
    }

    if(head.x + unit > food.x &&
        head.x < food.x + unit &&
        head.y + unit > food.y &&
        head.y < food.y + unit) eat();

    checkCollision();
}

function eat() {
    dom.sounds.eat.play();
    const bodyColor = colors.body;
    const eatingColor = colors.eating;
    eatFood();
    changeScore();

    //increase snake
    for(let i = 0; i < snake.increaseFactor; i++) {
        snake.body.push(new snakePart(0 - state.unit, 0));
    }
    dom.snake.textContent = `${snake.body.length}`;

    //change snake color after eating
    colors.body = eatingColor;
    colors.eating = bodyColor;
    setTimeout(() => {
        colors.body = bodyColor;
        colors.eating = eatingColor;
    }, 1000);
}


function checkCollision() {
    const head = snake.body[0];
    const body = snake.body;

    for(let i = 2; i < body.length; i++) {
        const part = body[i];

        if(head.x + state.unit > part.x &&
            head.x < part.x + state.unit &&
            head.y + state.unit > part.y &&
            head.y < part.y + state.unit) endGame();
    }
}


function changeSnakeColor(color) {
    snake.body.forEach((part, ind) => {
        dom.ctx.fillStyle = color;
        if (ind === 0 && state.game) dom.ctx.fillStyle = colors.head;
        dom.ctx.fillRect(part.x, part.y, state.unit, state.unit);
    })
}


function passCoordinates(x, y, count) {
    const currentX = snake.body[count].x;
    const currentY = snake.body[count].y;
    snake.body[count].x = x;
    snake.body[count].y = y;
    count++;
    count < snake.body.length && passCoordinates(currentX, currentY, count);
}


export default snake;

export {
    createNewSnake,
    moveSnake,
    changeSnakeColor,
}