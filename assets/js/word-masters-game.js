const guessContainerEl = document.getElementById('guess-container');

const currentGame = {
    solution: null,
    guesses: [],
    greenLetters: [],
    orangeLetters: [],
    greyLetters: [],
    disabledLetters: [],
    setSolution(solution) {
        this.solution = solution;
        saveCurrentGame();
    },
    addGuess(guess) {
        this.guesses.push(guess);
        saveCurrentGame();
    },
    addGreenLetter(letter) {
        this.greenLetters.push(letter);
        saveCurrentGame();
    },
    addOrangeLetter(letter) {
        this.orangeLetters.push(letter);
        saveCurrentGame();
    },
    addGreyLetter(letter) {
        this.greyLetters.push(letter);
        saveCurrentGame();
    },
    addDisabledLetter(letter) {
        this.disabledLetters.push(letter);
        saveCurrentGame();
    }
}

/* UI Functions */
let currentGuessRowEl = null;
const displayNewEmptyRow = () => {
    currentGuessRowEl = document.createElement('div');
    currentGuessRowEl.className = 'd-flex justify-content-center flex-nowrap';

    for(let i = 0; i < currentGame.solution.length; i++) {
        const letterBoxEl = document.createElement('div');
        letterBoxEl.className = 'border border-3 text-center m-md-1 m-sm-0 flex-shrink-0 square';

        currentGuessRowEl.appendChild(letterBoxEl);
    };

    const numResponseEl = document.createElement('div');
    numResponseEl.className = 'border border-3 text-center rounded-circle flex-shrink-0 circle';
    currentGuessRowEl.appendChild(numResponseEl);

    guessContainerEl.appendChild(currentGuessRowEl);
}

const displayLettersText = (letters) => {
    if(currentGuessRowEl){
        for(let i = 0; i < letters.length; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            letterBoxEl.textContent = letters[i];
        }
    }else{
        console.error('Cannot add letters to a null row element');
    }
}

const displayNumberReponse = (numCorrect) => {
    currentGuessRowEl.textContent = numCorrect;
}


const setUI = () => {
    guessContainerEl.innerHTML = '';
    
    displayNewEmptyRow();
}

/* Game Logic */
const startNewGame = (solutionLength) => {
    currentGame.guesses = [];
    currentGame.greenLetters = [];
    currentGame.orangeLetters = [];
    currentGame.greyLetters = [];
    currentGame.disabledLetters = [];
    currentGame.setSolution(getNewSolutionWord(solutionLength));

    //setUI();
}

const getNewSolutionWord = (solutionLength) => {
    // Solution word cannot have repeating letters
    let solution = '';
    let counter = 0;
    // console.log(`Generating Solution Word of length: ${solutionLength}`);
    while (solution === '' && counter < 1000) {
        counter++;
        let solutionHelper = getRandomWord(solutionLength);
        // console.log(solutionHelper);
        // Search for repeating letters
        for(let i = 0; i < solutionHelper.length; i++) {
            // console.log(`checking ${solutionHelper[i]}`);
            // console.log(solutionHelper.indexOf(solutionHelper[i]), solutionHelper.lastIndexOf(solutionHelper[i]));
            if(solutionHelper.indexOf(solutionHelper[i]) !== solutionHelper.lastIndexOf(solutionHelper[i])){
                // console.log('Repeating letter found');
                solutionHelper = '';
                break;
            }
        }
        solution = solutionHelper;
    }
    console.log(`Solution Word Found in ${counter} tries: ${solution}`);
    return solution;
}

/* Data Functions */
const saveCurrentGame = () => localStorage.setItem('wordMastersCurGame', JSON.stringify(currentGame));
const loadCurrentGame = () => JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;

/* Event Listeners */

/* Game Initialization */
loadWords().then(() => {
    initializeKeyboard();
    startNewGame(Math.floor(Math.random() * 7)+4);

});