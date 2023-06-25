const canvas = document.querySelector('canvas');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');



let canvasSize;
let elementsSize;
let level = 0;
let initialPlayerPosX;
let initialPlayerPosY;



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
        canvasSize = window.innerWidth*0.8;
    } else  {
        canvasSize = window.innerHeight*0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    startGame();
}

function startGame() {
    //console.log({ canvasSize, elementsSize });
  
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';
  
    const map = maps[level];
    
    if (!map){
      gameWin();
      return;
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
            initialPlayerPosX = posX;
            initialPlayerPosY= posY;
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
}

function lostLevel() {
  playerPosition.x = initialPlayerPosX;
  playerPosition.y = initialPlayerPosY;
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
  
    if ((playerPosition.y - elementsSize) < elementsSize) {
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
  
    if ((playerPosition.x + elementsSize) > canvasSize) {
      console.log('OUT');
    } else {
      playerPosition.x += elementsSize;
      startGame();
    }
  }
  function moveDown() {
    console.log('Down');
    
    if ((playerPosition.y + elementsSize) > canvasSize) {
      console.log('OUT');
    } else {
      playerPosition.y += elementsSize;
      startGame();
    }
  }