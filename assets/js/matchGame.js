const NUMBER_TILES = 16;
const ICON_MAP = ['☀','⚓','☣','☔','⚡','⛅','☢','⚔']

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
const initializeBoard = (numTiles) => {
    console.log(`Initializing board with ${numTiles} tiles`)
    for(let i = 0; i < numTiles; i++){
        const tile = document.createElement('div');
        tile.classList.add('tile');

        tile.addEventListener('click', flipTile);

        tiles.push(tile);
        gameBoard.appendChild(tile);
    }
}

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

const resetTileClasses = (tile) => {
    tile.classList.remove('flipped');
    tile.classList.remove('matched');
    tile.querySelector('span').classList.add('hidden');
}

const scatterTiles = () => {
    tiles.forEach(tile => {
        anime({
            targets: tile,
            translateX: () => anime.random(-500, 500),
            translateY: () => anime.random(-500, 500),
            rotate: () => anime.random(-720, 720),
            duration: 2000,
            easing: 'easeOutExpo',
            
        })
    })
}

const resetTilePosition = () => {
    tiles.forEach((tile,index) => {
        anime({
            targets: tile,
            //reset from current positon to 0
            translateX: 0,
            translateY: 0,
            rotate: 0,
            delay: 20*index,
            duration: 1000,
            easing: 'easeOutExpo',
        })
    })
}

const animateMatchedTiles = (flippedTiles) => {
    flippedTiles.forEach(tile => {
        anime({
            targets: tile,
            scale: [.5,1],
            opacity: [.5,1],
            duration: 700,
            easing: 'easeOutElastic',
        })
    })
}

const setUI = async (tileValues,matchedTiles,animate) => {
    if(animate){
        scatterTiles();
        await new Promise(res => setTimeout(res, 2200));
    }
    
    for (let i = 0; i < tileValues.length; i++) {
        tiles[i].dataset.value = tileValues[i];
        tiles[i].innerHTML = '<span class="hidden">' + ICON_MAP[tileValues[i]-1] + '</span>';

        if(matchedTiles.includes(tileValues[i])){
            setTilesMatched([tiles[i]]);
            setTileFlipped(tiles[i]);
        }else{
            resetTileClasses(tiles[i]);
        }
    }

    if(animate){
        resetTilePosition();
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
        animateMatchedTiles([tile1, tile2]);
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
        startGame();
    }
}

const startGame = (animate = true) =>{
    const tileValues = generateBoard(NUMBER_TILES);
    currentGame.setNewGame(tileValues);
    flippedTiles.length = 0;

    console.log(`Starting new game`);

    setUI(tileValues,[],animate);
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

newGameModalBtnEl.addEventListener('click', () => {startGame(),gameOverModal.hide()})
gameOverModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => newGameModalBtnEl.focus(),300));

const initGame = () => {
    initializeBoard(NUMBER_TILES);

    const [tileValues,matchedPairs] = currentGame.loadGame();
    if (tileValues.length === 0) {
        startGame(false);
    } else {
        setUI(tileValues,matchedPairs,false);
    }
}

initGame();
