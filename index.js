import direction, { changeDirection } from './js/direction.js';
import { pauseGame, startGame } from './js/game.js';
import { createNewSnake } from './js/snake.js';
import { eatFood } from './js/food.js';
import state, {
  colors,
  dom,
  showMessage
} from './js/state.js';

function initiate() {
  createNewSnake();
  //sets food invisible at the beginning
  eatFood();

  dom.canvas.width = state.fieldSize * state.unit;
  dom.canvas.height = state.fieldSize * state.unit;
  dom.ctx.lineWidth = state.strokeWidth;
  dom.ctx.strokeStyle = colors.stroke;
}
initiate();


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
      dom.historyWrapper.style.display = 'none';
      state.isModalOpen = false;
    }
    else startGame();
  }
})

dom.btns.play.addEventListener('click', (event) => {
  startGame();
  event.target.blur();
});

dom.btns.pause.addEventListener('click', (event) => {
  pauseGame()
  event.target.blur();
});


dom.btns.history.addEventListener('click', () => {
  pauseGame();
  state.isModalOpen = true;
  let scores = localStorage.getItem('snake-scores');

  if (scores) {
    //info about best score
    const bestP = document.createElement('p');
    const bestNumber = document.createElement('span');

    bestP.textContent = (`best score: `);
    bestNumber.textContent = localStorage.getItem('snake-best');
    bestNumber.classList.add('main__history-number');
    bestP.appendChild(bestNumber);
    
    dom.historyTitle.textContent = 'games history';
    dom.history.textContent = '';
    dom.history.appendChild(bestP);

    //create last games history from storage
    scores = scores.split(',');
    scores.forEach((score, ind) => {
      const p = document.createElement('p');
      const number = document.createElement('span');
      number.classList.add('container__history-number');
      number.textContent = score;
      p.textContent = `${++ind}) `;
      p.appendChild(number);
      dom.history.appendChild(p);
    });
    
    dom.historyWrapper.style.display = 'flex';
  } else showMessage('no scores yet');
}); 

dom.btns.historyOk.addEventListener('click', () => {
  dom.historyWrapper.style.display = 'none';
  state.isModalOpen = false;
});