const guessContainerEl = document.getElementById('guess-container');
const bodyEl = document.querySelector('body');

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
            letterBoxEl.className = 'col-1 border border-3 text-center rounded square m-1';
            letterBoxEl.textContent = 'A';
            guessRowEl.appendChild(letterBoxEl)
        }
        guessContainerEl.appendChild(guessRowEl);
    }
}

const changeLetterColor = () => {
    
}

const displayGuessWordColor = (guess) => {
    if(!isValidWord(guess)){
        //TODO: Change color of letters in word to red
    }
}



/* Game Logic */
let guess = '';
let alphabet = 'abcdefghijklmnopqrstuvwxyz';
const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    console.log('Key:', k);
    if (k === 'delete' || k === 'backspace') {
       if(guess.length !== 0) guess = guess.slice(0, -1);
       console.log(guess);
    } else if (k === 'enter') {
        handleGuess(guess);
    } else if(alphabet.includes(k)) {
        if(currentGame.solution.length > guess.length) guess += k;
        if(guess.length === currentGame.solution.length) displayGuessWordColor(guess);
        console.log(guess);
    }
}

const handleGuess = (guess) => {
    // currentGame.guesses.push(guess);
    // console.log('Guess:', guess);
    // console.log('Guesses:', currentGame.guesses);
}

/* Data Functions */



/* Event Listeners */
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));


/* Game Initialization */
loadWords();
createKeyboard();



















