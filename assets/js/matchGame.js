const gameBoard = document.getElementById('game-board');
let tiles = [];
let flippedTiles = [];
let matchedPairs = 0;
const tileValues = [];

for (let i = 1; i <= 8; i++) {
    tileValues.push(i, i);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    shuffle(tileValues);
    matchedPairs = 0; 
    tiles.forEach(tile => gameBoard.removeChild(tile)); 
    tiles = []; 

    for (let value of tileValues) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.value = value;
        tile.innerHTML = '<span class="hidden">' + value + '</span>'; 
        tile.addEventListener('click', flipTile);
        tiles.push(tile);
        gameBoard.appendChild(tile);
    }
}

function resetGame() {
    matchedPairs = 0;
    flippedTiles = []; 
    tiles.forEach(tile => {
        tile.classList.remove('flipped', 'matched');
        tile.querySelector('span').classList.add('hidden'); 
    });
}

function flipTile() {
    if (flippedTiles.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    this.classList.add('flipped');
    this.querySelector('span').classList.remove('hidden');
    flippedTiles.push(this);

    if (flippedTiles.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [tile1, tile2] = flippedTiles;

    if (tile1.dataset.value === tile2.dataset.value) {
        tile1.classList.add('matched');
        tile2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === 8) {
            alert('You won! All pairs matched.');
        }
    } else {
        setTimeout(() => {
            tile1.classList.remove('flipped');
            tile2.classList.remove('flipped');
            tile1.querySelector('span').classList.add('hidden'); 
            tile2.querySelector('span').classList.add('hidden'); 
        }, 1000);
    }

    flippedTiles = [];
}

const resetButton = document.getElementById('resetGame');
const newGameButton = document.getElementById('newGame');

resetButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', startGame);

startGame();
