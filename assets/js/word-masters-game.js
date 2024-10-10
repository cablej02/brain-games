//TODO: uncomment this and change script to type="module" in html
//import {getRandomWord, loadWords, isValidWord, initializeKeyboard, changeKeyGreen, changeKeyOrange, changeKeyGrey, disableKey } from './word-game.js';

const guessContainerEl = document.getElementById('guess-container');

// Game Object as an immediately invoked function expression
const currentGame = (() => {
    let solution = null;
    let guesses = [];
    let greenLetters = [];
    let orangeLetters = []; 
    let greyLetters = [];
    let disabledLetters = [];
    const saveCurrentGame = () => localStorage.setItem('wordMastersCurGame', JSON.stringify(currentGame)) && console.log('Game saved');
    return {
        setNewGame: (newSolution) => {
            solution = newSolution;
            guesses.length = 0;
            greenLetters.length = 0;
            orangeLetters.length = 0;
            greyLetters.length = 0;
            disabledLetters.length = 0;
            saveCurrentGame();
        },
        clearGame:() => {
            solution = null;
            guesses.length = 0;
            greenLetters.length = 0;
            orangeLetters.length = 0;
            greyLetters.length = 0;
            disabledLetters.length = 0;
            saveCurrentGame();
        },
        addGuess: guess => (guesses.push(guess), saveCurrentGame()),
        addGreenLetter: letter => (greenLetters.push(letter), saveCurrentGame()),
        addOrangeLetter: letter => (orangeLetters.push(letter), saveCurrentGame()),
        addGreyLetter: letter => (greyLetters.push(letter), saveCurrentGame()),
        addDisabledLetter: letter => (disabledLetters.push(letter), saveCurrentGame()),
        getSolution: () => solution,
        getGuesses: () => [...guesses],
        getGreenLetters: () => [...greenLetters],
        getOrangeLetters: () => [...orangeLetters],
        getGreyLetters: () => [...greyLetters],
        getDisabledLetters: () => [...disabledLetters]
    };
})();

/* UI Functions */
let currentGuessRowEl = null;
const displayNewEmptyRow = () => {
    currentGuessRowEl = document.createElement('div');
    currentGuessRowEl.className = 'd-flex justify-content-center flex-nowrap';

    for(let i = 0; i < currentGame.getSolution().length; i++) {
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
    currentGame.setNewGame(getNewSolutionWord(solutionLength));

    //setUI();
}

const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    console.log('Key:', k);
    if (k === 'delete' || k === 'backspace') {
        if(guess.length !== 0) guess = guess.slice(0, -1);
        console.log(guess);
    } else if (k === 'enter') {
        if(guess.length === currentGame.getSolution().length){
            console.log('Guess:', guess);
            currentGame.addGuess(guess);
            displayGuess(guess);
            guess = '';
        }
    } else if (alphabet.includes(k) && guess.length < currentGame.getSolution().length) {
        guess += k;
        console.log(guess);
    }
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
    
    if(counter === 1000){ 
        console.error(`Solution Word of length ${solutionLength} not found after ${counter} tries`);
        return null
    }else{
        console.log(`Solution Word Found in ${counter} tries: ${solution}`);
        return solution;
    }
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