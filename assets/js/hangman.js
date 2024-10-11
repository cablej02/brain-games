//element selectors
const bodyEl = document.querySelector('body');
const guessContainerEl = document.getElementById('guess-container');

//game object
const currentGame = {
    //TODO: fill in object with things needed for game
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


//UI functions
const displayRevealedLetter = (letter) =>{
    //TODO: Implement this function

}


//Game Logic
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    
    //TODO: Fill in logic of this function
    if (key === 'delete' || key === 'backspace') {
        console.log('Delete key pressed');
    } else if (key === 'enter') {
        console.log('Enter key pressed');
    } else {
        console.log('Letter key pressed:', key);
    }
}

const generateDisplayWord = () =>{

}

const startNewGame = () =>{
    //TODO: Implement this function
}

const handleGameOver = (winBool) =>{
    //TODO: Implement this function
}

//data functions
const saveCurrentGame = () =>{}//TODO: Implement this function
const loadCurrentGame = () =>{}//TODO: Implement this function

//Event Listeners
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));

//game initialization
loadWords().then(() => {
    initializeKeyboard();

    //TODO: Implement loading of saved game/starting a new game
    startNewGame();
});
