//element selectors
const bodyEl = document.querySelector('body');
const guessContainerEl = document.getElementById('guess-container');
const guessesRemainingEl = document.getElementById('guesses-remaining-txt'); // TODO with finding the way to show the guesses remaining
const newGameBtnEl = document.getElementById('new-game-btn');

//Anytime we start new game, we need to reset the keyboard
//Create the spans for each letter in the alphabet of the word
//When you start a new game, delete the old letter or word before it shows the new lines of guesses

//game object
const currentGame = (() => {
    let solution = null;
    const correctGuesses = [];
    const wrongGuesses = [];
    let maxGuesses = null;
    const saveData = () =>{
        const curGameHelper = {solution,correctGuesses,wrongGuesses,maxGuesses}
        localStorage.setItem('hangmanCurrentGame', JSON.stringify(curGameHelper));
    }
    const loadData = () =>{
        const data = JSON.parse(localStorage.getItem('hangmanCurrentGame') || null);
        if(data){
            solution = data.solution;
            correctGuesses.push(...data.correctGuesses);
            wrongGuesses.push(...data.wrongGuesses);
            maxGuesses = data.maxGuesses;
        }else{
            clearGame();
        }
    }
    const addCorrectGuess = (index,letter) => {
        correctGuesses[index] = letter;
        saveData();
    }
    const addWrongGuess = (guess) => {
        wrongGuesses.push(guess);
        saveData();
    }
    const setNewGame = (newSolution,newMaxGuesses) => {
        solution = newSolution;
        maxGuesses = newMaxGuesses;
        correctGuesses.length = 0;
        wrongGuesses.length = 0;
        saveData();
    }
    const clearGame = () => {
        solution = null;
        maxGuesses = null;
        correctGuesses.length = 0;
        wrongGuesses.length = 0;
        saveData();
    }
    return{
        addCorrectGuess,
        addWrongGuess,
        setNewGame,
        clearGame,
        loadData,
        getSolution: () => solution,
        getWrongGuesses: () => [...wrongGuesses],
        getCorrectGuesses: () => [...correctGuesses],
        getGuesses: () => [...correctGuesses, ...wrongGuesses],
        getMaxGuesses: () => maxGuesses
    }
})();

/* UI Functions */
const displayCorrectLetter = (index,letter) => {
    //create the id
    const id = `letter-${index}`;
    //get the element from dom
    const letterEl = document.getElementById(id);
    //adjust the element
    letterEl.textContent = letter.toUpperCase();
}

const displayGuessesRemaining = (guessesRemaining) => {
    guessesRemainingEl.textContent = `Guesses Remaining: ${guessesRemaining}`;
}

const createAndAppendNewLettersElements = (solWordLength) => {
    for (let i = 0; i < solWordLength; i++){
        //i = 0,1,2,3,4,5,6,7,8...
        const letterEl = document.createElement('div')
        letterEl.id = `letter-${i}`
        letterEl.classList.add('letter');
    
        //Append to guess container
        guessContainerEl.appendChild(letterEl)
    }
}

const setUI = () => {
    guessContainerEl.innerHTML = '';
    keyboard.resetKeys();

    const solution = currentGame.getSolution();
    createAndAppendNewLettersElements(solution.length);

    const correctGuesses = currentGame.getCorrectGuesses();
    for(let i = 0; i < correctGuesses.length; i++){
        const letter = correctGuesses[i];
        if(alphabet.includes(letter.toLowerCase())){
            keyboard.setKeyColorGreen(letter);
            displayCorrectLetter(i,letter);
        }
    }

    const wrongGuesses = currentGame.getWrongGuesses();
    wrongGuesses.forEach(letter => keyboard.disableKey(letter));
    
    displayGuessesRemaining(calcGuessesRemaining());
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    const solution = currentGame.getSolution();
    
    if(solution){
        if (alphabet.includes(k)) {
            const guesses = currentGame.getGuesses();
            
            if (!guesses.includes(k)) {
                if (solution.includes(k)){
                    keyboard.setKeyColorGreen(k);
                    for(let i = 0; i < solution.length; i++){
                        if(solution[i] === k){
                            currentGame.addCorrectGuess(i,k)
                            displayCorrectLetter(i,k);
                        }
                    }

                    //check if game is won
                    const correctGuesses = currentGame.getCorrectGuesses();
                    let winBool = true;
                    for(let i = 0; i < solution.length; i++){
                        if(!correctGuesses.includes(solution[i])){
                            winBool = false;
                            break;
                        }
                    }
                    console.log(generateDisplayWord());

                    if (winBool) handleGameOver(true);
                } else {
                    keyboard.disableKey(k);

                    currentGame.addWrongGuess(k);
                    
                    // calc guesses remaining
                    const guessesRemaning = calcGuessesRemaining();

                    //TODO: update UI for guesses remaining
                    displayGuessesRemaining(guessesRemaning);

                    if(guessesRemaning === 0){
                        handleGameOver(false);
                    }
                }
            }
        }
    }
}
const calcGuessesRemaining = () => {
    return currentGame.getMaxGuesses() - currentGame.getWrongGuesses().length;
}


//TODO: remove this, just printing to console or something, not informing UI I think?
const generateDisplayWord = () =>{
    const solution = currentGame.getSolution();
    const guesses = currentGame.getGuesses();
    let displayWord = solution.split('').map(letter => guesses.includes(letter) ? letter : '_').join('');
    return displayWord;
}

const startNewGame = () =>{
    let solution = wordList.getRandomWord(Math.floor(Math.random()*6 + 5));
    currentGame.setNewGame(solution, 5); //TODO: maybe put this in a static variable
    console.log(solution); //TODO: remove this eventually maybe MONDAY

    setUI();
}

const handleGameOver = (winBool) =>{
    const solution = currentGame.getSolution();
    //const guesses = calcGuessesRemaining();
    
    //adjust data for game over
    currentGame.clearGame();

    if(winBool){
        console.log(`You Win!`);
    }else{
        console.log(`You Lose! The word was: ${solution}`);
    }
}

//Event Listeners
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));
newGameBtnEl.addEventListener('click',startNewGame)

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
