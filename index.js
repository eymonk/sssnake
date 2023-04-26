import direction, { changeDirection } from './js/direction.js';
import { pauseGame, startGame } from './js/game.js';
import { createNewSnake } from './js/snake.js';
import { eatFood } from './js/food.js';
import state, {
  colors,
  dom,
  showMessage
} from './js/state.js';


/***** EVENT LISTENERS ******/
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  const dir = direction.buffer[direction.buffer.length - 1];

  if (key === 'arrowleft' && dir !== 'right') changeDirection('left');
  else if (key === 'arrowright' && dir !== 'left') changeDirection('right');
  else if (key === 'arrowup' && dir !== 'down') changeDirection('up');
  else if (key === 'arrowdown' && dir !== 'up') changeDirection('down');
  else if (key === 'escape') pauseGame();
  else if (key === 'enter') {
    if (state.isModalOpen) {
      dom.message.classList.add('hidden');
      state.isModalOpen = false;
    } else startGame();
  }
});

dom.btns.play.addEventListener('click', (event) => {
  startGame();
  event.target.blur();
});

dom.btns.pause.addEventListener('click', (event) => {
  pauseGame();
  event.target.blur();
});


dom.btns.history.addEventListener('click', () => {
  pauseGame();
  state.isModalOpen = true;
  let scores = localStorage.getItem('snake-scores');

  if (scores) {
    dom.bestScore.classList.remove('hidden');
    dom.bestScoreNumber.textContent = localStorage.getItem('snake-best');

    const container = document.createElement('div');
    scores = scores.split(',');
    scores.forEach((score, ind) => {
      const p = document.createElement('p');
      const number = document.createElement('span');
      number.classList.add('message__history-number');
      number.textContent = score;
      p.textContent = `${++ind}) `;
      p.appendChild(number);
      container.appendChild(p);
    });
    showMessage('game history', container);
  } else showMessage('no scores yet');

  dom.message.classList.remove('hidden');
});

dom.btns.messageOk.addEventListener('click', () => {
  dom.message.classList.add('hidden');
  dom.bestScore.classList.add('hidden');
  state.isModalOpen = false;
});

(function () {
  createNewSnake();
  //sets food invisible at the beginning
  eatFood();

  dom.canvas.width = state.fieldSize * state.unit;
  dom.canvas.height = state.fieldSize * state.unit;
  dom.ctx.lineWidth = state.strokeWidth;
  dom.ctx.strokeStyle = colors.stroke;
})();