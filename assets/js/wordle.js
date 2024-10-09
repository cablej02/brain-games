const guessContainerEl = document.getElementById('guess-container');

const currentGame = {
    
}

/* UI Functions */
const generateBoard = (numGuesses, wordLength) => {
    //Clear board
    guessContainerEl.innerHTML = '';

    for(let i = 0; i < numGuesses; i++) {
        //i=0
        const guessRowEl = document.createElement('div');
        guessRowEl.classList.add('guess');

        for(let j = 0; j < wordLength; j++){
            const letterBoxEl = document.createElement('div');
            letterBoxEl.classList.add('guess');
            guessRowEl.appendChild(letterBoxEl)
        }
        guessContainerEl.appendChild(guessRowEl);
    }
}




/* Game Logic */




/* Data Functions */



/* Event Listeners */


/* Game Initialization */
loadWords();
createKeyboard();



















