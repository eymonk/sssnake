const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

class Part {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}


/***** DOM ******/
const dom = {
  score: document.querySelector('.screen__score'),
  speed: document.querySelector('.screen__speed'),
  snake: document.querySelector('.screen__snake'),
  message: document.querySelector('.main__message'),
  history: document.querySelector('.main__history'),
  historyWrapper: document.querySelector('.main__history-wrapper'),
  historyTitle: document.querySelector('.main__history-title'),
  btns: {
    play: document.querySelector('.main__btn_play'),
    pause: document.querySelector('.main__btn_pause'),
    history: document.querySelector('.main__btn_history'),
    historyOk: document.querySelector('.main__btn_history-ok'),
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


/***** SNAKE ******/
const snake = {
  body: [],
  increaseFactor: 1,
  maxIncreaseFactor: 4,
  initialLength: 5,

  createNew () {
    this.body.length = 0;
    const random = getRandomPosition();
    for (let i = 0; i < this.initialLength; i++) {
      this.body.push(new Part(random.x, random.y));
    }
  },

  move () {
    const head = this.body[0];
    const unit = state.unit;
    const dir = direction.dir;
  
    this.passCoordinates(head.x, head.y, 1);
  
    if (dir === 'left') {
      head.x -= unit;
      if (head.x < 0) head.x = canvas.width - unit;
  
    } else if (dir === 'right') {
      head.x += unit;
      if (head.x + unit > canvas.width) head.x = 0;
      
    } else if (dir === 'up') {
      head.y -= unit;
      if (head.y < 0) head.y = canvas.height - unit;
      
    } else if (dir === 'down') {
      head.y += unit;
      if (head.y + unit> canvas.height) head.y = 0;
    }
  
    if(head.x + unit > food.x && 
      head.x < food.x + unit &&
      head.y + unit > food.y && 
      head.y < food.y + unit) this.eat();
  
    this.checkCollision();
  },

   eat() {
    dom.sounds.eat.play();
    const bodyColor = colors.body;
    const eatingColor = colors.eating;
    food.eat();
    state.changeScore();

    //increase snake
    for(let i = 0; i < this.increaseFactor; i++) {
      this.body.push(new Part(0 - state.unit, 0));
    }
    dom.snake.textContent = this.body.length;

    //change snake color after eating
    colors.body = eatingColor;
    colors.eating = bodyColor;
    setTimeout(() => {
      colors.body = bodyColor;
      colors.eating = eatingColor;
    }, 1000);
  },

  checkCollision () {
    const head = this.body[0];
    const body = this.body;

    for(let i = 2; i < body.length; i++) {
      const part = body[i];

      if(head.x + state.unit > part.x && 
        head.x < part.x + state.unit &&
        head.y + state.unit > part.y &&
        head.y < part.y + state.unit) game.end();
    }
  },

  changeColor (color) {
    this.body.forEach((part, ind) => {
      ctx.fillStyle = color;
      if (ind === 0 && game.inProcess) ctx.fillStyle = colors.head;
      ctx.fillRect(part.x, part.y, state.unit, state.unit);
    })
  },

  passCoordinates(x, y, count) {
    const currentX = this.body[count].x;
    const currentY = this.body[count].y;
    this.body[count].x = x;
    this.body[count].y = y;
    count++;
    count < snake.body.length && this.passCoordinates(currentX, currentY, count);
  },
}


/***** STATE ******/
const state = {
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

  reset () {
    game.isGameOver = false;
    this.factoredByScore = false;
    this.factoredByLength = false;
    this.score = 0;
    this.frameTime = 120;
    this.scoreFactor = 1;
    snake.increaseFactor = 1;
    food.interval = 6000;
    direction.dirBuffer = direction.random;
    dom.score.textContent = '00';
    dom.speed.textContent = 1;
    dom.snake.textContent = 5;
    snake.createNew();
  },

  changeScore () {
    this.score += this.scoreFactor;

    //increase scorefactor
    if (this.score >= 22 && !this.factoredByScore) {
      this.factoredByScore = true;
      this.scoreFactor++;
    } else if(snake.maxIncreaseFactor === snake.increaseFactor && !this.factoredByLength) {
      this.factoredByLength = true;
      this.scoreFactor++;
    } else if(this.frameTime <= this.frameMinTime && !this.factoredBySpeed) {
      this.factoredBySpeed = true;
      this.scoreFactor++;
    }

    const scoreStr = String(this.score);
    dom.score.textContent = scoreStr.length === 1 ? `0${scoreStr}` : scoreStr;

    if (food.interval > food.minInterval) food.interval -= 300;

    //increase snake grow factor
    if (!(state.score % 3) && snake.maxIncreaseFactor > snake.increaseFactor) snake.increaseFactor++;

    //increase speed
    if (state.frameTime >= state.frameMinTime) {
      let speed = Number(dom.speed.textContent);
      state.frameTime -= 4;
      dom.speed.textContent = ++speed;
    } else {
      dom.speed.textContent = 'max';
    }
  },

  saveScore () {
    const bestScore = Number(localStorage.getItem('snake-best'));
    let scores = localStorage.getItem('snake-scores');

    if (scores) {
      scores = scores.split(',');
      scores.length === 10 && scores.shift();
      if(bestScore < this.score) {
        localStorage.setItem('snake-best', this.score);
      } 
    } else {
      scores = [];
      localStorage.setItem('snake-best', this.score);
    }

    scores.push(this.score);
    localStorage.setItem('snake-scores', scores);
    this.showResult();
  },

  showResult () {
    function createResultString(text, number) {
      const p = document.createElement('p');
      const n = document.createElement('span');
      n.classList.add('main__history-number');
      p.textContent = text;
      n.textContent = number;
      p.appendChild(n);
      return p;
    }

    const snakeData = createResultString('snake length: ', snake.body.length);
    const scoreData = createResultString('your score: ', this.score);
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
  },

  showMessage (msg, short) {
    dom.message.textContent = msg
    if (short) setTimeout(() => dom.message.textContent = '', 3000);
  }
}


/***** GAME PROCESS ******/
const game = {
  inProcess: false,
  isGameOver: false,

  play () {
    if (!this.inProcess) {
      if (this.isGameOver) state.reset();
      dom.sounds.play.play();
      dom.btns.play.textContent = 'play';
      this.inProcess = true;
      animate();
      state.foodAnimation = setInterval(() => food.set(), food.interval);
      state.showMessage('good luck', true);
    }
  },

  pause () {
    if(this.inProcess) {
      dom.sounds.pause.play();
      this.inProcess = false;
      clearInterval(state.foodAnimation);
      state.showMessage('game paused');
    }
  },

  end() {
    this.isGameOver = true;
    dom.sounds.gameOver.play();
    this.pause();
    state.saveScore();
    snake.changeColor(colors.lost);
    dom.btns.play.textContent = 'new game';
  }
}


/***** DIRECTION ******/
const direction = {
  dir: 'right',
  dirBuffer: ['right'],

  change(dir) {
    this.dirBuffer.push(dir);
  },

  set () {
    const lastDir = this.dirBuffer[this.dirBuffer.length - 1];
    if (this.dir === 'right' && lastDir !== 'left') this.dir = lastDir;
    else if (this.dir === 'left' && lastDir !== 'right') this.dir = lastDir;
    else if (this.dir === 'up' && lastDir !== 'down') this.dir = lastDir;
    else if (this.dir === 'down' && lastDir !== 'up') this.dir = lastDir;
  },

  random () {
    return ['right', 'left', 'up', 'down'][Math.round(Math.random() * 4)];
  }
}


/***** FOOD ******/
const food = {
  x: 0,
  y: 0,
  interval: 6000,
  minInterval: 3500,

  set () {
    dom.sounds.food.play();
    const random = getRandomPosition();
    this.x = random.x;
    this.y = random.y;
  },

  eat () {
    this.x = 0 - state.unit;
    this.y = 0 - state.unit;
  },
}


function getRandomPosition() {
  const unit = state.unit;
  const x = Math.floor(Math.random() * (canvas.height / unit)) * unit;
  const y = Math.floor(Math.random() * (canvas.height / unit)) * unit;
  return {x, y};
}


function draw() {
  const unit = state.unit;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = colors.food;
  ctx.fillRect(food.x, food.y, unit, unit);

  //draw snake
  snake.changeColor(colors.body);
}

function animate() {
  if (game.inProcess) {
    direction.set();
    draw();
    snake.move();
    setTimeout(() => requestAnimationFrame(animate), state.frameTime);
  }
}


function initiate() {
  snake.createNew();

  //sets food invisible at the beginnig
  food.eat(); 

  canvas.width = state.fieldSize * state.unit;
  canvas.height = state.fieldSize * state.unit;
  ctx.lineWidth = state.strokeWidth;
  ctx.strokeStyle = colors.stroke;
}
initiate();


/***** EVENT LISTENERS ******/
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  const dir = direction.dirBuffer[direction.dirBuffer.length - 1];
  if (key === 'arrowleft' && dir !== 'right') direction.change('left');
  else if (key === 'arrowright' && dir !== 'left') direction.change('right');
  else if (key === 'arrowup' && dir !== 'down') direction.change('up');
  else if (key === 'arrowdown' && dir !== 'up') direction.change('down');
  else if (key === 'escape') game.pause();
  else if (key === 'enter') {
    if (state.isModalOpen) {
      dom.historyWrapper.style.display = 'none';
      state.isModalOpen = false;
    }
    else game.play();
  }
})

dom.btns.play.addEventListener('click', (event) => {
  game.play();
  event.target.blur();
});

dom.btns.pause.addEventListener('click', (event) => {
  game.pause()
  event.target.blur();
});


dom.btns.history.addEventListener('click', () => {
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
      number.classList.add('main__history-number');
      number.textContent = score;
      p.textContent = `${++ind}) `;
      p.appendChild(number);
      dom.history.appendChild(p);
    });
    
    dom.historyWrapper.style.display = 'flex';
  } else {
    state.showMessage('no scores yet');
  }
}); 

dom.btns.historyOk.addEventListener('click', () => {
  dom.historyWrapper.style.display = 'none';
  state.isModalOpen = false;
});