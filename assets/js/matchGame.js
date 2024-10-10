//delete commments, only using to keep me organized

const gameBoard = document.getElementById('game-board'); 
let tiles = []; 
let flippedTiles = []; 
let matchedPairs = 0; 
const tileValues = []; 

// Paired tiles
for (let i = 1; i <= 2; i++) { // start at 1 and repeat until 2, i++ increments up by 1 
    tileValues.push(i, i); // this array has 2 of the same number being push, essentially the same number twice
}

function shuffle(array) { //Fisher-Yates shuffle src = wikipedia
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array; 
} // yoinked this. get what it does, still understanding how and iff it works

shuffle(tileValues); 

for (let i = 0; i < tileValues.length; i++) { 
    const tile = document.createElement('div'); // tiles
    tile.classList.add('tile'); //add stlying
    tile.dataset.value = tileValues[i]; //assigns value to tile from the value of the tileValue duh 
    tile.innerHTML = '<span class="hidden">' + tileValues[i] + '</span>'; //hides tiles when palced
    tile.addEventListener('click', flipTile); //need to create a fliped tile function
    tiles.push(tile); 
    gameBoard.appendChild(tile); //puts in the gameBoard
}
// need to style CSS next to start to see this in action, dont even know if this will work yet
// believe i have main stuff down but can not confirm until i see something