//element selectors
const bodyEl = document.querySelector('body');
const guessContainerEl = document.getElementById('guess-container');
const guessesRemainingEl = document.getElementById('guesses-remaining'); // TODO with finding the way to show the guesses remaining

//Anytime we start new game, we need to reset the keyboard
//Create the spans for each letter in the alphabet of the word
//When you start a new game, delete the old letter or word before it shows the new lines of guesses

//game object
const currentGame = (() => {
    let solution = null;
    const guesses = [];
    let maxGuesses = null;
    const save = () =>{
        const curGameHelper = {solution,guesses,maxGuesses}
        localStorage.setItem('hangmanCurrentGame', JSON.stringify(curGameHelper));
    }
    const load = () =>{
        const data = JSON.parse(localStorage.getItem('hangmanCurrentGame') || null);
        if(data){
            solution = data.solution;
            guesses.push(...data.guesses);
            maxGuesses = data.maxGuesses;
        }else{
            clearGame();
        }
    }
    const addGuess = (guess) => {
        guesses.push(guess);
        save();
    }
    const setNewGame = (newSolution,newMaxGuesses) => {
        solution = newSolution;
        maxGuesses = newMaxGuesses;
        guesses.length = 0;
        save();
    }
    const clearGame = () => {
        solution = null;
        maxGuesses = null;
        guesses.length = 0;
        save();
    }
    return{
        addGuess,
        setNewGame,
        clearGame,
        load
    }
})();

//UI functions
const displayRevealedLetter = (letter) => {
    const span = document.createElement('span');
    span.textContent = letter;
    guessContainerEl.appendChild(span);
    currentGame.guesses

}


const setUI = () => {
    //TODO: set full ui for new/loaded game
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
    let displayWord = solution.split('').map(letter => guesses.includes(letter) ? letter : '_').join('');

    return displayWord;
}

const startNewGame = () =>{
    let solution = wordList.getRandomWord(Math.floor(Math.random)*6 + 5); //TODO: make this a user input to choose word length, or randomize
    currentGame.setNewGame(solution, 5); //TODO: maybe put this in a static variable
    console.log(solution);

    setUI();
}

const handleGameOver = (winBool) =>{
    
}

//data functions


//Event Listeners
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));

//game initialization
wordList.loadWords().then(() => {
    keyboard.initialize(false);

    //TODO: Implement loading of saved game/starting a new game
    startNewGame();
});
