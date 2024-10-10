const guessContainerEl = document.getElementById('guess-container');

const currentGame = {
    solution: null,
    guesses: [],
}

/* UI Functions */
const displayNewEmptyGuessRow = () => {
    const guessRowEl = document.createElement('div');
    guessRowEl.className = 'row justify-content-center';

    currentGame.solution.split('').forEach(() => {
        const letterBoxEl = document.createElement('div');
        letterBoxEl.className = 'guess-letter col-1 border border-3 text-center rounded square m-1';
        letterBoxEl.textContent = 'A';
        guessRowEl.appendChild(letterBoxEl);
    });

    guessContainerEl.appendChild(guessRowEl);
}

/* Game Logic */


const startNewGame = () => {
    currentGame.guesses = [];
    currentGame.solution = getRandomWord();

    //reset UI
    //TODO: probably put this in a separate function
    guessContainerEl.innerHTML = '';
}

/* Data Functions */
const saveCurrentGame = () => localStorage.setItem('wordMastersCurGame', JSON.stringify(currentGame));
const loadCurrentGame = () => JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;

/* Event Listeners */

/* Game Initialization */
const setUI = () => {
    
}

loadWords().then(() => {
    createKeyboard();
    startNewGame();

});