//TODO: uncomment this and change script to type="module" in html
//import {getRandomWord, loadWords, isValidWord, initializeKeyboard, changeKeyGreen, changeKeyOrange, changeKeyGrey, disableKey } from './word-game.js';

const guessContainerEl = document.getElementById('guess-container');
const bodyEl = document.querySelector('body');

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
        for(let i = 0; i < currentGuessRowEl.children.length; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            if(i < letters.length){
                letterBoxEl.textContent = letters[i].toUpperCase();
            }else{
                letterBoxEl.textContent = '';
            }
        }
    }else{
        console.error('Cannot add letters to a null row element');
    }
}

const displayNumberReponse = (numCorrect) => {
    currentGuessRowEl.textContent = numCorrect;
}

const setGuessTextRed = () => {
    if(currentGuessRowEl){
        for(let i = 0; i < currentGuessRowEl.children.length; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            letterBoxEl.style.color = 'red';
        }
    }else{
        console.error('Cannot add letters to a null row element');
    }
}

const setCurGuessTextWhite = () => {
    if(currentGuessRowEl){
        for(let i = 0; i < currentGuessRowEl.children.length; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            letterBoxEl.style.color = 'white';
        }
    }else{
        console.error('Cannot add letters to a null row element');
    }
}


const setUI = () => {
    guessContainerEl.innerHTML = '';
    
    displayNewEmptyRow();
}

/* Game Logic */
let guess = '';
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    console.log('Key:', k);
    if (k === 'delete' || k === 'backspace') {
        guess = guess.slice(0, -1);
        displayLettersText(guess);
        setCurGuessTextWhite();
        console.log(guess);
    } else if (k === 'enter') {
        if(guess.length === currentGame.getSolution().length){
            handleGuess(guess);
        }
    } else if (alphabet.includes(k) && guess.length < currentGame.getSolution().length) {
        guess += k;
        displayLettersText(guess);
        if(guess.length === currentGame.getSolution().length) {
            isValidWord(guess) ? setCurGuessTextWhite() : setGuessTextRed();
        }
        console.log(guess);
    }
}

const handleGuess = (guess) => {
    

}

const getNewSolutionWord = (solutionLength) => {
    // Solution word cannot have repeating letters
    let solution = '';
    let counter = 0;
    while (solution === '' && counter < 1000) {
        counter++;
        let solutionHelper = getRandomWord(solutionLength);
        // Search for repeated letters
        for(let i = 0; i < solutionHelper.length; i++) {
            if(solutionHelper.indexOf(solutionHelper[i]) !== solutionHelper.lastIndexOf(solutionHelper[i])){
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

const startNewGame = (solutionLength) => {
    currentGame.setNewGame(getNewSolutionWord(solutionLength));

    setUI();
}

/* Data Functions */
const saveCurrentGame = () => localStorage.setItem('wordMastersCurGame', JSON.stringify(currentGame));
const loadCurrentGame = () => JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;

/* Event Listeners */
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));

/* Game Initialization */
loadWords().then(() => {
    initializeKeyboard(false);
    startNewGame(Math.floor(Math.random() * 7)+4);

});