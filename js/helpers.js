import state, { dom } from './state.js';

function getRandomCanvasPosition() {
    const unit = state.unit;
    const x = Math.floor(Math.random() * (dom.canvas.width / unit)) * unit;
    const y = Math.floor(Math.random() * (dom.canvas.height / unit)) * unit;
    return {x, y};
}

export {
    getRandomCanvasPosition,
}