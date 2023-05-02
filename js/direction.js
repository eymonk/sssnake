import { pauseGame, startGame } from './game.js';
import state, { dom } from './state.js';

const direction = {
    current: 'right',
    buffer: ['right'],
}


function changeDirection(dir) {
    direction.buffer.push(dir);
}


function setDirection() {
    const lastDir = direction.buffer[direction.buffer.length - 1];
    if (direction.current === 'right' && lastDir !== 'left') direction.current = lastDir;
    else if (direction.current === 'left' && lastDir !== 'right') direction.current = lastDir;
    else if (direction.current === 'up' && lastDir !== 'down') direction.current = lastDir;
    else if (direction.current === 'down' && lastDir !== 'up') direction.current = lastDir;
}


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


export default direction;
export { setDirection, changeDirection };