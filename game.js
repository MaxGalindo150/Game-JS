const canvas = document.querySelector('canvas');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('.lives');
const spanTime = document.querySelector('.time');
const spanRecord = document.querySelector('.record');
const pResult = document.querySelector('.result');
const finalMessage = document.querySelector('#game-completed'); 
const gameOverMessage = document.querySelector('#game-over');


let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;


const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPositions = []

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)

function setCanvasSize() {

    if (window.innerWidth > window.innerHeight) {
        canvasSize = window.innerWidth*0.36;
    } else  {
        canvasSize = window.innerHeight*0.36;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function startGame() {
    //console.log({ canvasSize, elementsSize });
    countLives();
    showRecord();
  
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';
  
    const map = maps[level];
    
    if (!map){
      gameWin();
      return;
    }

    if (!timeStart) {
      timeStart = Date.now();
      timeInterval = setInterval(countTime,100);
      showRecord
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    //console.log({map, mapRows, mapRowCols});
    
    enemyPositions = []
    game.clearRect(0,0,canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
      row.forEach((col, colI) => {
        const emoji = emojis[col];
        const posX = elementsSize * (colI + 1);
        const posY = elementsSize * (rowI + 1);

        if (col == 'O') {
            if (!playerPosition.x && !playerPosition.y){
                playerPosition.x = posX;
                playerPosition.y = posY;
            }
        } else if (col == 'I') {
            giftPosition.x = posX;
            giftPosition.y = posY;
        } else if (col == 'X') {
            enemyPositions.push({
                x: posX,
                y: posY,
            })
        }

        game.fillText(emoji, posX, posY);
      });
    });
    movePlayer();
}

//Move player
function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin();
    }

    const enemyCollision = enemyPositions.find( enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY
    });
    
    if (enemyCollision) {
        lostLevel();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log('Next level')
  level += 1
  startGame();
}

function gameWin() {
  console.log('You won!!!')
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;


  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'YOU BEAT THE RECORD! :)';
    } else {
      pResult.innerHTML = 'I\'m sorry, but you didnt surpass the record this time :( <br> Don\'t give up!';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Great job on your first attempt! Now, challenge yourself and try to surpass your previous time. You can do it!';
  }
  showFinalMessage();
}

function lostLevel() {
  lives--;

  console.log(lives)
  if (lives<=0) {
    gameOverMessage.classList.remove('inactive');
    //level = 0;
    //lives = 3;
    //timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function countLives() {
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
}

function countTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

function showFinalMessage() {
  finalMessage.classList.remove('inactive')
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
  }


function moveUp() {
    console.log('Up');
  
    if ((playerPosition.y.toFixed(5) - elementsSize) < elementsSize) {
      console.log('OUT');
    } else {
      playerPosition.y -= elementsSize;
      startGame();
    }
  }
  function moveLeft() {
    console.log('Left');
    if ((playerPosition.x.toFixed(5) - elementsSize.toFixed(5)) < elementsSize) {
      console.log('OUT');
    } else {
      playerPosition.x -= elementsSize;
      startGame();
    }
  }
  function moveRight() {
    console.log('Right');
  
    if ((playerPosition.x.toFixed(5) + elementsSize) > canvasSize) {
      console.log('OUT');
    } else {
      playerPosition.x += elementsSize;
      startGame();
    }
  }
  function moveDown() {
    console.log('Down');
    
    if ((playerPosition.y.toFixed(5) + elementsSize) > canvasSize) {
      console.log('OUT');
    } else {
      playerPosition.y += elementsSize;
      startGame();
    }
  }