const guessContainerEl = document.getElementById('guess-container');

const currentGame = {
    solution: 'banana',
    guesses: ['toggle'],
    maxGuesses: 6
}

/* UI Functions */
const generateBoard = (numGuesses, wordLength) => {
    //Clear board
    guessContainerEl.innerHTML = '';

    for(let i = 0; i < numGuesses; i++) {
        const guessRowEl = document.createElement('div');
        guessRowEl.className = 'row justify-content-center';

        for(let j = 0; j < wordLength; j++){
            const letterBoxEl = document.createElement('div');
            letterBoxEl.className = 'col-1 border border-3 text-center';
            letterBoxEl.textContent = 'A';
            guessRowEl.appendChild(letterBoxEl)
        }
        guessContainerEl.appendChild(guessRowEl);
    }
}

const changeLetterColor = () => {
    
}




/* Game Logic */




/* Data Functions */



/* Event Listeners */


/* Game Initialization */
loadWords();
createKeyboard();



















