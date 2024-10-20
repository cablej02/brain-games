const SOLUTION_LENGTH = 5;
const MAX_TIME = 30;

const tileContainerEl = document.getElementById('tile-container');
const submitBtnEl = document.getElementById('submit-btn');
const newGameBtnEl = document.getElementById('new-game-btn');
const bodyEl = document.querySelector('body');
const timerTextEl = document.getElementById('timer-text');

//modal selectors
const modalBtnEl = document.getElementById('modal-btn');

const cancelGameModal = new bootstrap.Modal(document.getElementById('cancel-game-modal'));
const cancelGameModalEl = document.getElementById('cancel-game-modal');
const cancelGameModalTextEl = document.getElementById('cancel-game-txt');
const cancelGameModalBtnEl = document.getElementById('cancel-game-btn');

const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
const gameOverModalEl = document.getElementById('game-over-modal');
const gameOverModalTextEl = document.getElementById('game-over-txt');
const newGameModalBtnEl = document.getElementById('new-game-btn');


const currentGame = (()=>{
    let solution = null;
    let timeLeft = 0;
    const saveData = () => {
        const curGameHelper = {
            solution,
            timeLeft
        }
        localStorage.setItem('scrambleGameCurGame', JSON.stringify(curGameHelper));
    }
    const loadData = () => {
        const data = JSON.parse(localStorage.getItem('scrambleGameCurGame')) || null;
        if(data === null){
            clearGame();
        }else{
            solution = data.solution;
            timeLeft = data.timeLeft;
        }
        return timeLeft;
    }
    const setNewGame = (newSolWord,newTimeLeft) => {
        solution = newSolWord;
        timeLeft = newTimeLeft;
        saveData();
        return timeLeft;
    }
    const clearGame = () => {
        solution = null;
        timeLeft = 0;
        saveData();
    }
    const setTimeLeft = (newTimeLeft) => {
        timeLeft = newTimeLeft;
        saveData();
    }
    return{
        getSolution: () => solution,
        getTimeLeft: () => timeLeft,
        setTimeLeft,
        setNewGame,
        clearGame,
        loadData,
    }
})();

/* UI functions */
// initialize sortable
const sortable = new Sortable(tileContainerEl, {
    animation: 300,  // Animation speed (ms) for drag transitions
    ghostClass: 'sortable-ghost'  // Class for the dragging item
});


const getGuess = () => {
    let guess = ''
    const tiles = document.querySelectorAll('.tile');
    console.log(`current tiles: ${tiles}`);
    for (let i = 0; i < tiles.length; i++) {    
        guess += tiles[i].innerText;
    }
    return guess.toLowerCase();
}

const setTimeLeftText = (timeLeft) => {
    currentGame.setTimeLeft(timeLeft);
    timerTextEl.innerHTML = `<span>Time Left: <b>${timeLeft}</b></span>`;
}

const animateTilesRight = () => {
    [...tileContainerEl.children].forEach(()=>{
        anime({
            targets: '.tile',
            translateX: 2000,
            easing: 'easeOutExpo',
            duration: 700,
        })

    })
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const setUI = async (timeLeft) => {
    if(tileContainerEl.children.length > 0){
        animateTilesRight();
        await delay(300);
    }
    // clear out any existing tiles
    tileContainerEl.innerHTML = '';

    // get shuffled solution word
    const shuffledWord = shuffle();

    for(let i = 0; i < shuffledWord.length; i++){
        //create new tiles
        const tile = document.createElement('span');

        //set new tile properties/classes/etc
        tile.classList = 'tile rounded p-2 m-1 fw-bold'
        tile.innerText = shuffledWord[i].toUpperCase();

        //append tiles to tileContainer
        tileContainerEl.appendChild(tile);
    }

    [...tileContainerEl.children].forEach(tile => {
        anime({
            targets: '.tile',
            translateX: [-window.innerWidth, 0], 
            easing: 'easeOutExpo',
            duration: 1200,
        })
    })
    //pause for 1.2 seconds before enabling drag
    setTimeLeftText(timeLeft);

    setTimeout(() => {
        sortable.option('disabled', false);
        initTimer(timeLeft);
    }, 600);
}

/* Game Logic */
const handleGuess = () => {
    if(currentGame.getSolution() === null) return;

    const guess = getGuess();
    if(guess === currentGame.getSolution()){
        handleGameOver(true);
    }else{
        anime({
            targets: '.tile',
            translateX: [-7,7],
            easing: 'easeInOutSine',
            duration: 100,
            direction: 'alternate',
            loop: 5,
        });
    }
}

const shuffle = () => {
    const solution = currentGame.getSolution();
    let shuffledSolWord = null;

    while(shuffledSolWord === null){
        let wordArray = solution.split("");
        for(let i = wordArray.length -1; i > 0; i--){
            //i = 4,3,2,1
            let j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        const result = wordArray.join("");
        console.log(`result: ${result} solution: ${solution}`);

        if(result !== solution){
            shuffledSolWord = result;
        }
    }

    return shuffledSolWord;
}

let counter = null;
const initTimer = (maxTime) => {
    timeLeft = maxTime;

    if (counter) {
        clearInterval(counter);
    }

    counter = setInterval(() => {
        if(timeLeft > 0){
            timeLeft--;
            setTimeLeftText(timeLeft);
            return;
        }
        clearInterval(counter);
        counter = null;
        handleGameOver(false);
    }, 1000);
}

const handleModalBtnClick = () => {
    //if no active game, start new game
    if(currentGame.getSolution() === null){
        startGame();
    }else{
        //if game is active, show cancel modal
        cancelGameModal.show();
    }
}


const handleGameOver = (winBool) => {
    const solution = currentGame.getSolution();
    clearInterval(counter);
    currentGame.clearGame();

    //Make items not draggable
    sortable.option('disabled', true);

    if(winBool){
        gameOverModalTextEl.innerHTML = `Congratulations!<br>You Win!`;
    }else{
        gameOverModalTextEl.innerHTML = `Nice try!<br><br>The word was: ${solution.toUpperCase()}`;
    }

    gameOverModal.show();
}

const startGame = (SOLUTION_LENGTH) => {
    const randomWord = wordList.getRandomWord(SOLUTION_LENGTH);
    const timeLeft = currentGame.setNewGame(randomWord, MAX_TIME);

    setUI(timeLeft);
}

/* Event Listeners */
newGameBtnEl.addEventListener('click', () => startGame(SOLUTION_LENGTH));
submitBtnEl.addEventListener('click',handleGuess);
bodyEl.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'enter') {
        handleGuess();
    }
});

//event listeners for modal buttons
modalBtnEl.addEventListener('click', () => handleModalBtnClick());

cancelGameModalBtnEl.addEventListener('click', () => {cancelGameModal.hide(),handleGameOver(false)});
cancelGameModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => cancelGameModalBtnEl.focus(),300));

newGameModalBtnEl.addEventListener('click', () => {startGame(),gameOverModal.hide()})
gameOverModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => newGameModalBtnEl.focus(),300));


/* Initialize game */
wordList.loadWords().then(() => {
    currentGame.loadData();

    if(currentGame.getSolution() === null){
        startGame(SOLUTION_LENGTH);
    }else{
        setUI(currentGame.getTimeLeft());
    }
});