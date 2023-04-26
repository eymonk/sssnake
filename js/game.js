import { changeSnakeColor } from './snake.js';
import food, { setFood } from './food.js';
import state, {
    dom,
    colors,
    resetState,
    saveScore,
    animate,
    notify
} from './state.js';


function startGame() {
    if (!state.game) {
        if (state.isGameOver) resetState();
        food.foodAnimation = setInterval(() => setFood(), food.interval);
        notify('good luck', true);
        dom.btns.play.textContent = 'play';
        dom.sounds.play.play();
        state.game = true;
        animate();
    }
}


function pauseGame() {
    if(state.game) {
        clearInterval(food.foodAnimation);
        notify('game paused');
        dom.sounds.pause.play();
        state.game = false;
    }
}


function endGame() {
    dom.btns.play.textContent = 'new game';
    changeSnakeColor(colors.lost);
    dom.sounds.gameOver.play();
    notify('game over');
    state.isGameOver = true;
    pauseGame();
    saveScore();
}


export {
    startGame,
    pauseGame,
    endGame,
}