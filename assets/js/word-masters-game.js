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
    currentGuessRowEl.className = 'd-flex justify-content-center flex-nowrap';

    for(let i = 0; i < currentGame.solution.length; i++) {
        const letterBoxEl = document.createElement('div');
        letterBoxEl.className = 'border border-3 text-center rounded square m-md-1 m-sm-0 flex-shrink-1 ';
        letterBoxEl.style.width = '60px';
        letterBoxEl.style.minWidth = '20px';
        letterBoxEl.style.maxWidth = '60px';
        letterBoxEl.style.height = 'auto'; 
        letterBoxEl.textContent = 'Z';

        currentGuessRowEl.appendChild(letterBoxEl);
    };

    const numResponseEl = document.createElement('div');
    numResponseEl.className = 'border border-3 text-center rounded-circle m-md-1 m-sm-0 flex-shrink-1';
    numResponseEl.style.width = '60px';
    numResponseEl.style.minWidth = '20px';
    numResponseEl.style.maxWidth = '60px';
    numResponseEl.style.height = 'auto';  
    numResponseEl.style.aspectRatio = '1 / 1';
    numResponseEl.textContent = '1';
    currentGuessRowEl.appendChild(numResponseEl);


    guessContainerEl.appendChild(currentGuessRowEl);
}

const displayNumberReponse = (numCorrect) => {
    currentGuessRowEl.textContent = numCorrect;
}

/* Game Logic */


const startNewGame = () => {
    currentGame.guesses = [];
    currentGame.solution = getRandomWord(5);

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