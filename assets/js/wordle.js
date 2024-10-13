const newGameBtnEl = document.getElementById('new-game-btn');
const guessContainerEl = document.getElementById('guess-container');
const bodyEl = document.querySelector('body');

const currentGame = {
    solution: null,
    guesses: [],
    maxGuesses: null,
    addGuess(guess){
        this.guesses.push(guess);
        saveCurrentGame();
    },
    setNewGame(solution,maxGuesses){
        this.solution = solution;
        this.maxGuesses = maxGuesses;
        this.guesses = [];
        saveCurrentGame();
    },
    clearGame(){
        this.solution = null;
        this.maxGuesses = null;
        this.guesses = [];
        saveCurrentGame();
    }
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

const displayLetterColorChange = () => {
    
}

const displayGuess = (guess) => {

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
    if (guess.length === currentGame.solution.length) {
        if (guess === currentGame.solution){
            console.log('Correct word:', guess);
            handleGameOver(true);
        }else{
            if(isValidWord(guess)){
                console.log(`Valid word: ${guess}`);
                currentGame.addGuess(guess);

                //TODO: Display ui response
            }else {
                console.log(`Invalid word: ${guess}`);
                //TODO: Display invalid word message
            }
        }
    }else{
        //TODO: Display a not enough letters message
    }

    // currentGame.guesses.push(guess);
    // console.log('Guess:', guess);
    // console.log('Guesses:', currentGame.guesses);
}

const handleGameOver = (winBool) => {
    const solution = currentGame.solution;
    currentGame.clearGame();

    if(winBool){
        console.log('You Win!');
    }else{
        console.log(`You Lose! The solution word was: ${solution}`);
    }
}

const startNewGame = () => {

}

/* Data Functions */
const saveCurrentGame = () => localStorage.setItem('wordleCurGame',JSON.stringify(currentGame));
const loadCurrentGame = () => localStorage.getItem('wordleCurGame') || null;


/* Event Listeners */
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));
newGameBtnEl.addEventListener('click', startNewGame);

/* Game Initialization */
loadWords();
keyboard.initialize();



















