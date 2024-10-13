//element selectors
const bodyEl = document.querySelector('body');
const guessContainerEl = document.getElementById('guess-container');
const guessesRemainingEl = document.getElementById('guesses-remaining'); // TODO with finding the way to show the guesses remaining

//Anytime we start new game, we need to reset the keyboard
//Create the spans for each letter in the alphabet of the word
//When you start a new game, delete the old letter or word before it shows the new lines of guesses

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
    if (alphabet.includes(k)) {
        if (!currentGame.guesses.includes(k)) {
            currentGame.addGuess(k);
            if (currentGame.solution.includes(k)){  
                keyboard.setKeyColorGreen(k);              
                console.log(generateDisplayWord());
            } else {
                keyboard.disableKey(k);
            }
        }
    }
}


const generateDisplayWord = () =>{
    const solution = currentGame.solution;
    const guesses = [...currentGame.guesses];
    let displayWord = '';
    for(let i = 0; i < solution.length; i++){
        if(guesses.includes(solution[i])){
            displayWord += solution[i];
        }else{
            displayWord += '_';
        }
    }
    return displayWord;
}

// 

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
    keyboard.initialize(false);

    //TODO: Implement loading of saved game/starting a new game
    startNewGame();
});
