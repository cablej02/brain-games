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


// Flipping a tile
function flipTile() {
    if (flippedTiles.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    } // check conditions 1. 2 tiles flipped, no actions 2. checks if tile is flipped ALREADY 
    //3. does not allow matched tiles to "flip" again
    
    this.classList.add('flipped'); //adds class "flipped" 
    this.querySelector('span').classList.remove('hidden'); //checks for "span" element (value) and removes "hidden" class
    flippedTiles.push(this); //adding any flipped tile to "this" array

    if (flippedTiles.length === 2) {
        checkForMatch(); //if 2 tiles flipped then calls the checkForMatch function
    }
}
// now need a checkForMatch function. try setting array to === with tile.dataset.value
// DEBUG game allows you to flip only 2 tiles, need to be unflipped if not match
// Game needs to allow further progression past two tiles. It is stuck on only flipping two and 
// then it stops the loop. DEBUG