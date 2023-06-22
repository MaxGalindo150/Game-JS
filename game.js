const canvas = document.querySelector('canvas');
const game = canvas.getContext('2d');

let canvasSize;
let elementsSize;

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
    console.log(123 + "456")
    game.font = elementsSize + 'px Verdana'
    game.textAlign = 'end';
    
    for (let i = 1; i<=10; i++) {
        game.fillText(emojis['X'], elementsSize*i, elementsSize);
    } 
}
