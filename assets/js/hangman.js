//statics
const MAX_GUESSES = 7;

//element selectors
const bodyEl = document.querySelector('body');
const guessContainerEl = document.getElementById('guess-container');
const guessesRemainingEl = document.getElementById('guesses-remaining-txt');
const guessedLetterEl = document.getElementById('guessed-letter')

//Bootstrap Colors
const rootStyles = getComputedStyle(document.documentElement);
const successColor = rootStyles.getPropertyValue('--bs-success').trim();
const dangerColor = rootStyles.getPropertyValue('--bs-danger').trim();
const bodyColor = rootStyles.getPropertyValue('--bs-body').trim();

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

//game object as an Immediately Invoked Function Expression
// const game = {
//     solution: null,
//     correctGuesses: [],
//     wrongGuesses: [],
//     maxGuesses: null,
// }

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
        getMaxGuesses: () => maxGuesses,
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
    return letterEl;
}

const displayGuessesRemaining = (guessesRemaining) => {
    if (guessesRemaining === 1) {
        guessesRemainingEl.style.color = dangerColor;
    } else if(guessesRemaining === 0){
        guessesRemainingEl.style.color = dangerColor;
    } else {
        guessesRemainingEl.style.color = bodyColor;
    }
    guessesRemainingEl.textContent = guessesRemaining;
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

// const animateGuessesRemaining = () => {
//     console.log(guessesRemainingEl);
//     anime({
//         targets: guessesRemainingEl,
//         scale: [1, 5],
//         translateX: [-10, 10, -10, 7, -4, 2, 0],
//         duration: 1000,
//         easing: 'easeOutElastic',
//     })
// }

const animateSolutionLetter = (letterEl) => {
    anime({
        targets: letterEl,
        scale: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic'
    })
}

const animateCorrectGuessLetter = () => {
    guessedLetterEl.style.color = successColor;
    anime({
        targets: guessedLetterEl,
        opacity: [1,0],
        translateY: [0,-150],
        scale: [5,0],
        duration: 1000,
        easing: 'easeInExpo',
    })
}

const animateWrongGuessLetter = () => {
    guessedLetterEl.style.color = dangerColor;
    anime({
        targets: guessedLetterEl,
        opacity: [1,0],
        translateX: [-10,10,-10,7,-4,2,0,0,0,0,0,0,0,0,0],
        translateY: [0,150],
        scale: [5,0],
        duration: 1000,
        easing: 'easeInExpo',
    })
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
    const k = key.toLowerCase();
    const solution = currentGame.getSolution();   // Checking if there is an active game
    
    if(solution){                                 // In case the solution word includes the letter picked by player
        if (alphabet.includes(k)) {
            const guesses = currentGame.getGuesses();
            
            if (!guesses.includes(k)) {                  // For the correct guesses, set color green on keybord to the letter on keyboard
                if (solution.includes(k)){               
                    keyboard.setKeyColorGreen(k);
                    guessedLetterEl.textContent = k.toUpperCase();
                    animateCorrectGuessLetter();                         // Set the text content on lines and popup correct letter on screen
                    for(let i = 0; i < solution.length; i++){            // Loop over the solution word to add the letter on the correct index of the solution word
                        if(solution[i] === k){                           
                            currentGame.addCorrectGuess(i,k)             // Adding guesses to the correctGuesses Array on the currentGame and save
                            const letterEl = displayCorrectLetter(i,k);
                            animateSolutionLetter(letterEl);              // Displaying correct letter and animating the appearance over the lines
                        }
                    }

                    
                    const correctGuesses = currentGame.getCorrectGuesses();   // Checking if the game is won
                    let winBool = true;
                    for(let i = 0; i < solution.length; i++){
                        if(!correctGuesses.includes(solution[i])){
                            winBool = false;
                            break;
                        }
                    }
                    console.log(generateDisplayWord());

                    if (winBool) handleGameOver(true);
                } else {                                                    // Animation of incorrect guesses poping up on screen with animation
                    guessedLetterEl.textContent = k.toUpperCase();
                    animateWrongGuessLetter();

                    keyboard.disableKey(k);                                  // Disable letter from keyboard

                    currentGame.addWrongGuess(k);                            // Adding wrong guesses to the wrongGuesses Array in currentGame and save
                    
                    const guessesRemaning = calcGuessesRemaining();          // Calculating the guesses remaining 

                    displayGuessesRemaining(guessesRemaning);                // Updating guesses remaining and showing them to player

                    if(guessesRemaning === 0){                               // When there is no more guesses the game i over
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
wordList.loadWords(GAME_TYPE.HANGMAN).then(() => {
    keyboard.initialize(false);

    currentGame.loadData();

    if(currentGame.getSolution() === null){
        startNewGame();
    }else{
        setUI();
    }
});
