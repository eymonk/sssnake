import { changeSnakeColor } from './snake.js';
import food, { setFood } from './food.js';
import state, {
    dom,
    colors,
    resetState,
    saveScore,
    animate, notify
} from './state.js';

function startGame() {
    if (!state.game) {
        if (state.isGameOver) resetState();
        dom.sounds.play.play();
        dom.btns.play.textContent = 'play';
        state.game = true;
        animate();
        state.foodAnimation = setInterval(() => setFood(), food.interval);
        notify('good luck', true);
    }
}

function pauseGame() {
    if(state.game) {
        dom.sounds.pause.play();
        state.game = false;
        clearInterval(state.foodAnimation);
        notify('game paused');
    }
}

function endGame() {
    state.isGameOver = true;
    dom.sounds.gameOver.play();
    pauseGame();
    saveScore();
    changeSnakeColor(colors.lost);
    dom.btns.play.textContent = 'new game';
}

export {
    startGame,
    pauseGame,
    endGame,
}