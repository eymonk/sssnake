
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


export default direction;

export {
    changeDirection,
    setDirection,
}