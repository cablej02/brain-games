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
    const saveData = () =>{
        const curGameHelper = {solution,guesses,maxGuesses}
        localStorage.setItem('hangmanCurrentGame', JSON.stringify(curGameHelper));
    }
    const loadData = () =>{
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
        saveData();
    }
    const setNewGame = (newSolution,newMaxGuesses) => {
        solution = newSolution;
        maxGuesses = newMaxGuesses;
        guesses.length = 0;
        saveData();
    }
    const clearGame = () => {
        solution = null;
        maxGuesses = null;
        guesses.length = 0;
        saveData();
    }
    return{
        addGuess,
        setNewGame,
        clearGame,
        loadData,
        getSolution: () => solution,
        getGuesses: () => [...guesses],
        getMaxGuesses: () => maxGuesses
    }
})();

//UI functions
const displayRevealedLetter = (letter) => {
    const span = document.createElement('span');
    span.textContent = letter;
    guessContainerEl.appendChild(span);
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
        if (!currentGame.getGuesses().includes(k)) {
            currentGame.addGuess(k);
            if (currentGame.getSolution().includes(k)){  
                keyboard.setKeyColorGreen(k);              
                console.log(generateDisplayWord());
            } else {
                keyboard.disableKey(k);
            }
        }
    }
}


const generateDisplayWord = () =>{
    const solution = currentGame.getSolution();
    const guesses = currentGame.getGuesses();
    let displayWord = solution.split('').map(letter => guesses.includes(letter) ? letter : '_').join('');
    return displayWord;
}

const startNewGame = () =>{
    let solution = wordList.getRandomWord(Math.floor(Math.random)*6 + 5);
    currentGame.setNewGame(solution, 5); //TODO: maybe put this in a static variable
    console.log(solution); //TODO: remove this eventually maybe

    setUI();
}

const handleGameOver = (winBool) =>{
    //TODO: this function
}

//Event Listeners
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));

//game initialization
wordList.loadWords().then(() => {
    keyboard.initialize(false);

    currentGame.loadData();

    if(currentGame.getSolution() === null){
        startNewGame();
    }else{
        setUI();
    }
});
