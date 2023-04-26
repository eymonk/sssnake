import direction, { setDirection } from './direction.js';
import food from './food.js';
import snake, {
    changeSnakeColor,
    createNewSnake,
    moveSnake
} from './snake.js';


const state = {
    isGameOver: false,
    game: false,
    animation: null,
    foodAnimation: null,
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
    strokeWidth: 2,
}


const dom = {
    canvas: document.querySelector('.canvas'),
    ctx: document.querySelector('.canvas').getContext('2d'),
    score: document.querySelector('.screen__score'),
    speed: document.querySelector('.screen__speed'),
    snake: document.querySelector('.screen__snake'),
    message: document.querySelector('.container__message'),
    history: document.querySelector('.container__history'),
    historyWrapper: document.querySelector('.container__history-wrapper'),
    historyTitle: document.querySelector('.container__history-title'),
    btns: {
        play: document.querySelector('.container__btn_play'),
        pause: document.querySelector('.container__btn_pause'),
        history: document.querySelector('.container__btn_history'),
        historyOk: document.querySelector('.container__btn_history-ok'),
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


function showResult() {
    function createResultString(text, number) {
        const p = document.createElement('p');
        const n = document.createElement('span');
        n.classList.add('container__history-number');
        p.textContent = text;
        n.textContent = number;
        p.appendChild(n);
        return p;
    }

    const snakeData = createResultString('snake length: ', snake.body.length);
    const scoreData = createResultString('your score: ', state.score);
    const speedData = createResultString('your speed: ', dom.speed.textContent);
    const bestData = createResultString(`best score: `, localStorage.getItem('snake-best'));
    const br = document.createElement('br');

    dom.history.textContent = '';
    dom.history.appendChild(scoreData);
    dom.history.appendChild(speedData);
    dom.history.appendChild(snakeData);
    dom.history.appendChild(br);
    dom.history.appendChild(bestData);
    dom.historyTitle.textContent = 'game over';
    dom.historyWrapper.style.display = 'flex';
    state.isModalOpen = true;
}


function changeScore() {
    state.score += state.scoreFactor;

    //increase score factor
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

    dom.score.textContent = String(state.score);

    if (food.interval > food.minInterval) food.interval -= 300;

    //increase snake grow factor
    if (!(state.score % 3) && snake.maxIncreaseFactor > snake.increaseFactor) snake.increaseFactor++;

    //increase speed
    if (state.frameTime >= state.frameMinTime) {
        let speed = Number(dom.speed.textContent);
        state.frameTime -= 4;
        dom.speed.textContent = `${++speed}`;
    } else {
        dom.speed.textContent = 'max';
    }
}

function saveScore() {
    const bestScore = Number(localStorage.getItem('snake-best'));
    let scores = localStorage.getItem('snake-scores');

    if (scores) {
        scores = scores.split(',');
        scores.length === 10 && scores.shift();
        if(bestScore < state.score) {
            localStorage.setItem('snake-best', state.score);
        }
    } else {
        scores = [];
        localStorage.setItem('snake-best', state.score);
    }

    scores.push(state.score);
    localStorage.setItem('snake-scores', scores);
    showResult();
}

function showMessage(msg, short) {
    dom.message.textContent = msg
    if (short) setTimeout(() => dom.message.textContent = '', 3000);
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
}