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
    tile.classList.add('tile'); //add class
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

// Check if the flipped tiles match
function checkForMatch() {
    const [tile1, tile2] = flippedTiles; // taking the array flippedTiles and assigning tile1 and tile2

    if (tile1.dataset.value === tile2.dataset.value) { // checks to see value of tile
        tile1.classList.add('matched');
        tile2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === 2) { //number of matches to win. needs to change with number of tiles/2
            alert('You won! All pairs matched.'); //need new "alert" cant be alert or prompt
        } //check bootstrap
    } else {
        setTimeout(() => {
            tile1.classList.remove('flipped'); //takes away flipped class
            tile2.classList.remove('flipped'); // for tile 2
            tile1.querySelector('span').classList.add('hidden'); // adds back hidden to the span element
            tile2.querySelector('span').classList.add('hidden'); // for tile 2
        }, 1000); // length of timeout remember in ms
    }

    flippedTiles = [];// reseting flipped tiles. fixes bug
}


// need to add reset button
// need to add new game
// need to add tutorial button
// need to add home button
//maybe make a slide bar for how many squares you want. DO THIS LAST IF DECIDED