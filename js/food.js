import { getRandomCanvasPosition } from './helpers.js';
import state, { dom } from './state.js';

const food = {
    x: 0,
    y: 0,
    interval: 6000,
    minInterval: 3500,
}

function setFood() {
    const random = getRandomCanvasPosition();
    food.x = random.x;
    food.y = random.y;
    dom.sounds.food.play();
}

function eatFood() {
    food.x = 0 - state.unit;
    food.y = 0 - state.unit;
}

export default food;

export {
    setFood,
    eatFood,
}