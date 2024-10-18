//statics
const MAX_GUESSES = 7;

//element selectors
const bodyEl = document.querySelector('body');
const guessContainerEl = document.getElementById('guess-container');
const guessesRemainingEl = document.getElementById('guesses-remaining-txt');

//modal selectors
const modalBtnEl = document.getElementById('modal-btn');

const cancelGameModal = new bootstrap.Modal(document.getElementById('cancel-game-modal'));
const cancelGameModalEl = document.getElementById('cancel-game-modal');
const cancelGameModalTextEl = document.getElementById('cancel-game-txt');
const cancelGameModalBtnEl = document.getElementById('cancel-game-btn');

const gameOverModal = new bootstrap.Modal(document.getElementById('game-over-modal'));
const gameOverModalEl = document.getElementById('game-over-modal');
const gameOverModalTextEl = document.getElementById('game-over-txt');
const newGameModalBtnEl = document.getElementById('new-game-btn');

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
        if(letter === null || letter === undefined || letter === '') {
            continue;
        }
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
                    
                    const guessesRemaning = calcGuessesRemaining();

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

const handleModalBtnClick = () => {
    //if no active game, start new game
    if(currentGame.getSolution() === null){
        startNewGame();
    }else{
        //if game is active, show cancel modal
        cancelGameModal.show();
    }
}

const startNewGame = () =>{
    let solution = wordList.getRandomWord(Math.floor(Math.random()*6 + 5));
    currentGame.setNewGame(solution, MAX_GUESSES); //TODO: maybe put this in a static variable
    console.log(solution); 

    setUI();
}

const handleGameOver = (winBool) =>{
    const solution = currentGame.getSolution();

    //adjust data for game over
    currentGame.clearGame();

    //show modal
    if(winBool){
        gameOverModalTextEl.innerHTML = `Congratulations!<br>You Win!`;
    }else{
        gameOverModalTextEl.innerHTML = `Nice try!<br><br>The word was: ${solution.toUpperCase()}`;
    }
    gameOverModal.show();
}

//Event Listeners
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));


modalBtnEl.addEventListener('click', () => handleModalBtnClick());

cancelGameModalBtnEl.addEventListener('click', () => {cancelGameModal.hide(),handleGameOver(false)});
cancelGameModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => cancelGameModalBtnEl.focus(),300));

newGameModalBtnEl.addEventListener('click', () => {startNewGame(),gameOverModal.hide()})
gameOverModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => newGameModalBtnEl.focus(),300));



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
