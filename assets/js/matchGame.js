const NUMBER_TILES = 16;

const gameBoard = document.getElementById('game-board');
const tiles = [];
const flippedTiles = [];

//Modal selectors
const modalBtnEl = document.getElementById('modal-btn');

const cancelGameModal = new bootstrap.Modal(document.getElementById('cancel-game-modal'));
const cancelGameModalEl = document.getElementById('cancel-game-modal');
const cancelGameModalTextEl = document.getElementById('cancel-game-txt');
const cancelGameModalBtnEl = document.getElementById('cancel-game-btn');

const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
const gameOverModalEl = document.getElementById('game-over-modal');
const gameOverModalTextEl = document.getElementById('game-over-txt');
const newGameModalBtnEl = document.getElementById('new-game-btn');

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
        if(!matchedPairs.includes(pairNum)){
            matchedPairs.push(pairNum);
            saveGame();
        }
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
    gameBoard.innerHTML = '';
    tiles.length = 0;
    
    for (let i = 0; i < tileValues.length; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.value = tileValues[i];
        tile.innerHTML = '<span class="hidden">' + tileValues[i] + '</span>';

        if(matchedTiles.includes(tileValues[i])){
            setTilesMatched([tile]);
            setTileFlipped(tile);
        }else{
            tile.addEventListener('click', flipTile);
        }
        tiles.push(tile);
        gameBoard.appendChild(tile);
    }
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

function flipTile() {
    if (flippedTiles.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
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
        currentGame.addMatchedPair(parseFloat(tile1.dataset.value));
        if (currentGame.getMatchedPairs().length === NUMBER_TILES/2) {
            handleGameOver(true);
        }
    } else {
        setTimeout(() => {
            setTilesHidden([tile1, tile2]);
        }, 1000);
    }

    flippedTiles.length = 0;
}

const handleModalBtnClick = () => {
    if(currentGame.getTileValues().length !== 0){
        cancelGameModal.show();
    } else {
        startGame(NUMBER_TILES);
    }
}

const startGame = (numTiles) =>{
    const tileValues = generateBoard(numTiles);
    currentGame.setNewGame(tileValues);
    flippedTiles.length = 0;

    console.log(`Starting new game with ${numTiles} tiles`);

    setUI(tileValues,[]);
}

const handleGameOver = (isWin) => {

    currentGame.setEmptyGame();
    if (isWin) {
        gameOverModalTextEl.textContent = 'You win!';
    } else {
        gameOverModalTextEl.textContent = 'Nice Try Bucko!';
    }

    gameOverModal.show();
}

modalBtnEl.addEventListener('click', () => handleModalBtnClick());

cancelGameModalBtnEl.addEventListener('click', () => {cancelGameModal.hide(),handleGameOver(false)});
cancelGameModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => cancelGameModalBtnEl.focus(),300));

newGameModalBtnEl.addEventListener('click', () => {startGame(NUMBER_TILES),gameOverModal.hide()})
gameOverModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => newGameModalBtnEl.focus(),300));



const initGame = () => {
    const [tileValues,matchedPairs] = currentGame.loadGame();
    if (tileValues.length === 0) {
        startGame(NUMBER_TILES);
    } else {
        setUI(tileValues,matchedPairs);
    }
}

initGame();
