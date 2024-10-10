const guessContainerEl = document.getElementById('guess-container');

const currentGame = {
    solution: null,
    guesses: [],
    greenLetters: [],
    orangeLetters: [],
    greyletters: [],
    disabledLetters: [],
}

/* UI Functions */
let currentGuessRowEl = null;
const addNewEmptyGuessRow = () => {
    currentGuessRowEl = document.createElement('div');
    currentGuessRowEl.className = 'row justify-content-center';

    for(let i = 0; i < currentGame.solution.length; i++) {
        const letterBoxEl = document.createElement('div');
        letterBoxEl.className = 'guess-letter col-1 border border-3 text-center rounded square m-1';
        currentGuessRowEl.appendChild(letterBoxEl);
    };

    const numResponseEl = document.createElement('div');
    numResponseEl.className = 'col-2 border border-3 text-center rounded circle m-1';

    guessContainerEl.appendChild(currentGuessRowEl);
}

const displayNumberReponse = (numCorrect) => {
    currentGuessRowEl.textContent = numCorrect;
}

/* Game Logic */


const startNewGame = () => {
    currentGame.guesses = [];
    currentGame.solution = getRandomWord();

    //reset UI
    //TODO: probably put this in a separate function
    guessContainerEl.innerHTML = '';
    addNewEmptyGuessRow();
}

/* Data Functions */
const saveCurrentGame = () => localStorage.setItem('wordMastersCurGame', JSON.stringify(currentGame));
const loadCurrentGame = () => JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;

/* Event Listeners */

/* Game Initialization */
const setUI = () => {
    
}

loadWords().then(() => {
    initializeKeyboard();
    startNewGame();

});