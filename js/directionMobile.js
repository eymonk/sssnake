import { changeDirection } from './direction.js';

const lastTouchMove = [];

function setDirectionMobile() {
    if (Math.abs(lastTouchMove[0].x - lastTouchMove[1].x) > Math.abs(lastTouchMove[0].y - lastTouchMove[1].y)) {
        const difference = lastTouchMove[0].x - lastTouchMove[1].x;
        if (difference > 0) changeDirection('left');
        else changeDirection('right');
    } else {
        const difference = lastTouchMove[0].y - lastTouchMove[1].y;
        if (difference > 0) changeDirection('up');
        else changeDirection('down');
    }
}


document.body.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    lastTouchMove[0] = {
        x: touch.clientX,
        y: touch.clientY
    };
});


document.body.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    lastTouchMove[1] = {
        x: touch.clientX,
        y: touch.clientY
    };
    setDirectionMobile();
});