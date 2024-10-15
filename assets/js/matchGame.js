const NUMBER_TILES = 16;

const gameBoard = document.getElementById('game-board');
const tiles = [];
const flippedTiles = [];

const currentGame = (() => {
    const tileValues = [];
    const matchedPairs = [];
    const saveGame = () => {
        const curGameHelper = {
            tileValues,matchedPairs
        }
        localStorage.setItem('matchGameSaveData', JSON.stringify(curGameHelper));
    }
    const loadGame = () => {
        const data = JSON.parse(localStorage.getItem('matchGameSaveData')) || null;

        if (data === null){
            setEmptyGame();
        }else{
            tileValues.push(...data.tileValues);
            matchedPairs.push(...data.matchedPairs);
        }
        return [tileValues,matchedPairs];
    }
    const setNewGame = (tileValueArr) => {
        tileValues.length = 0;
        tileValues.push(...tileValueArr);
        matchedPairs.length = 0;
        saveGame();
    }
    const setEmptyGame = () => {
        tileValues.length = 0;
        matchedPairs.length = 0;
        saveGame();
    }
    const addMatchedPair = (pairNum) => {
        matchedPairs.push(pairNum);
        saveGame();
    }
    return {
        getTileValues: () => [...tileValues], 
        getMatchedPairs: () => [...matchedPairs], 
        loadGame,
        setNewGame,
        setEmptyGame,
        addMatchedPair
    }
})();


/* UI Functions */
const setTileFlipped = (tile) => {
    tile.classList.add('flipped');
    tile.querySelector('span').classList.remove('hidden');
}
const setTilesMatched = (tiles) => {
    tiles.forEach(tile => tile.classList.add('matched'));
}
const setTilesHidden = (tiles) => {
    tiles.forEach(tile => {
        tile.classList.remove('flipped');
        tile.querySelector('span').classList.add('hidden'); 
    });
}

const setUI = (tileValues,matchedTiles) => {
    console.log('before: ', gameBoard.innerHTML);
    gameBoard.innerHTML = '';
    tiles.length = 0;
    console.log('after: ', gameBoard.innerHTML);

    for (let i = 0; i < tileValues.length; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.value = tileValues[i];
        tile.innerHTML = '<span class="hidden">' + tileValues[i] + '</span>'; 
        tile.addEventListener('click', flipTile);
        tiles.push(tile);
        gameBoard.appendChild(tile);
    }
    console.log(gameBoard.children.length);
}

/* Game Logic */
const generateBoard = (numTiles) => {
    if(numTiles % 2 !== 0) {
        console.error('Number of tiles must be even');
        return null;
    }

    const tileValues = [];
    for (let i = 1; i <= numTiles/2; i++) {
        tileValues.push(i, i);
    }

    for (let i = tileValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileValues[i], tileValues[j]] = [tileValues[j], tileValues[i]];
    }
    return tileValues;
}

const startGame = (numTiles) =>{
    const tileValues = generateBoard(numTiles);
    currentGame.setNewGame(tileValues);
    flippedTiles.length = 0;

    console.log(`generated new game with ${tileValues} tiles`);

    setUI(tileValues);
}

function flipTile() {
    if (flippedTiles.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }

    console.log('hello, who is this: ', this);
    
    flippedTiles.push(this);

    setTileFlipped(this);

    if (flippedTiles.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [tile1, tile2] = flippedTiles;

    if (tile1.dataset.value === tile2.dataset.value) {
        setTilesMatched([tile1, tile2]);
        currentGame.addMatchedPair(tile1.dataset.value);
        if (currentGame.getMatchedPairs() === NUMBER_TILES/2) {
            handleGameOver(true);
        }
    } else {
        setTimeout(() => {
            setTilesHidden([tile1, tile2]);
        }, 1000);
    }

    flippedTiles.length = 0;
}

const handleGameOver = (isWin) => {
    if (isWin) {
        console.log('You win!');
    } else {
        console.log('You lose!');
    }
    resetGame();
}

const newGameButton = document.getElementById('newGame');
newGameButton.addEventListener('click', () => startGame(NUMBER_TILES));

const initGame = () => {
    const [tileValues,matchedPairs] = currentGame.loadGame();
    if (tileValues.length === 0) {
        startGame(NUMBER_TILES);
    } else {
        setUI(tileValues,matchedPairs);
    }
}

initGame();
