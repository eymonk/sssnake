import direction, { setDirection } from './direction.js';
import food from './food.js';
import snake, {
    changeSnakeColor,
    createNewSnake,
    moveSnake
} from './snake.js';


const state = {
    game: false,
    isGameOver: false,
    animation: null,
    isModalOpen: false,
    score: 0,
    scoreFactor: 1,
    factoredByScore: false,
    factoredByLength: false,
    factoredBySpeed: false,
    unit: 20,
    fieldSize: 26,
    frameTime: 120,
    frameMinTime: 45,
    notificationTimeout: null,
}


const dom = {
    canvas: document.querySelector('.canvas'),
    canvasWrapper: document.querySelector('.container__wrapper_canvas'),
    menuWrapper: document.querySelector('.container__btn-wrapper'),
    ctx: document.querySelector('.canvas').getContext('2d'),
    score: document.querySelector('.screen__score'),
    speed: document.querySelector('.screen__speed'),
    snake: document.querySelector('.screen__snake'),
    notification: document.querySelector('.container__notification'),
    message: document.querySelector('.message'),
    messageTitle: document.querySelector('.message__title'),
    messageText: document.querySelector('.message__text'),
    bestScore: document.querySelector('.message__best-score'),
    bestScoreNumber: document.querySelector('.best-score'),

    btns: {
        play: document.querySelector('.container__btn_play'),
        pause: document.querySelector('.container__btn_pause'),
        history: document.querySelector('.container__btn_history'),
        messageOk: document.querySelector('.message__btn_ok'),
    },

    sounds: {
        play: document.querySelector('.sound__play'),
        eat: document.querySelector('.sound__eat'),
        food: document.querySelector('.sound__food'),
        pause: document.querySelector('.sound__pause'),
        gameOver: document.querySelector('.sound__game-over'),
    }
}


const colors = {
    head: '#6f3',
    body: '#393',
    stroke: '#333',
    food: '#fa2',
    eating: '#ee5',
    lost: '#911',
}


function showMessage(title, text) {
    dom.message.classList.remove('hidden');
    dom.messageTitle.textContent = title;
    dom.messageText.textContent = '';
    if (text) {
        if (typeof text === 'string') dom.messageText.textContent = text;
        else dom.messageText.appendChild(text);
    }
}


function notify(text, isShort) {
    dom.notification.textContent = text;
    clearTimeout(state.notificationTimeout);
    if (isShort) state.notificationTimeout = setTimeout(() => dom.notification.textContent = '', 3000);
}


function draw() {
    const unit = state.unit;
    dom.ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    dom.ctx.fillStyle = colors.food;
    dom.ctx.fillRect(food.x, food.y, unit, unit);
    changeSnakeColor(colors.body);
}


function animate() {
    if (state.game) {
        setDirection();
        draw();
        moveSnake();
        setTimeout(() => requestAnimationFrame(animate), state.frameTime);
    }
}


function resetState() {
    state.isGameOver = false;
    state.factoredByScore = false;
    state.factoredByLength = false;
    state.score = 0;
    state.frameTime = 120;
    state.scoreFactor = 1;
    snake.increaseFactor = 1;
    food.interval = 6000;
    direction.buffer = ['right'];
    dom.score.textContent = '0';
    dom.speed.textContent = '1';
    dom.snake.textContent = '5';
    createNewSnake();
}


function createResultString(text, number) {
    const p = document.createElement('p');
    const n = document.createElement('span');
    n.classList.add('message__history-number');
    p.textContent = text;
    n.textContent = number;
    p.appendChild(n);
    return p;
}


function showResult() {
    const snakeData = createResultString('snake length: ', snake.body.length);
    const scoreData = createResultString('your score: ', state.score);
    const speedData = createResultString('your speed: ', dom.speed.textContent);
    const bestData = createResultString(`best score: `, localStorage.getItem('snake-best'));
    const br = document.createElement('br');
    const container = document.createElement('div');

    container.appendChild(scoreData);
    container.appendChild(speedData);
    container.appendChild(snakeData);
    container.appendChild(br);
    container.appendChild(bestData);

    showMessage('game over', container);
    state.isModalOpen = true;
}


function increaseScoreFactor() {
    if (state.score >= 22 && !this.factoredByScore) {
        state.factoredByScore = true;
        state.scoreFactor++;
    } else if(snake.maxIncreaseFactor === snake.increaseFactor && !state.factoredByLength) {
        state.factoredByLength = true;
        state.scoreFactor++;
    } else if(state.frameTime <= state.frameMinTime && !state.factoredBySpeed) {
        state.factoredBySpeed = true;
        state.scoreFactor++;
    }
}


function increaseSpeed() {
    if (state.frameTime >= state.frameMinTime) {
        let speed = Number(dom.speed.textContent);
        state.frameTime -= 4;
        dom.speed.textContent = `${++speed}`;
    } else dom.speed.textContent = 'max';
}


function changeScore() {
    dom.score.textContent = String(state.score += state.scoreFactor);

    //increase food appear interval
    if (food.interval > food.minInterval) food.interval -= 300;
    //increase snake grow factor
    if (!(state.score % 3) && snake.maxIncreaseFactor > snake.increaseFactor) snake.increaseFactor++;

    increaseScoreFactor();
    increaseSpeed();
}


function saveScore() {
    const bestScore = Number(localStorage.getItem('snake-best'));
    let scores = localStorage.getItem('snake-scores');

    if (scores) {
        scores = scores.split(',');
        scores.length === 10 && scores.shift();
        if (bestScore < state.score) localStorage.setItem('snake-best', state.score);
    } else {
        scores = [];
        localStorage.setItem('snake-best', state.score);
    }

    scores.push(state.score);
    localStorage.setItem('snake-scores', `${scores}`);
    showResult();
}


export default state;
export {
    dom,
    colors,
    resetState,
    animate,
    changeScore,
    saveScore,
    showMessage,
    notify,
}