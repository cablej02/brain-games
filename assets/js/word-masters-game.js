//TODO: uncomment this and change script to type="module" in html
//import {getRandomWord, loadWords, isValidWord, initializeKeyboard, changeKeyGreen, changeKeyOrange, changeKeyGrey, disableKey } from './word-game.js';

const guessContainerEl = document.getElementById('guess-container');
const bodyEl = document.querySelector('body');
const gameOverTxtEl = document.getElementById('game-over-txt');
const newGameBtnEl = document.getElementById('new-game-btn');
const endlessGameBtnEl = document.getElementById('endless-game-btn');

// Game Object as an immediately invoked function expression
const currentGame = (() => {
    let solution = null;
    const guesses = [];
    const greenLetters = [];
    const orangeLetters = []; 
    const greyLetters = [];
    const disabledLetters = [];
    const saveCurrentGame = () => {
        const curGameHelper = {
            solution,
            guesses,
            greenLetters,
            orangeLetters,
            greyLetters,
            disabledLetters
        }
        localStorage.setItem('wordMastersCurGame', JSON.stringify(curGameHelper)) && console.log('Game saved');
    }
    return {
        loadCurrentGame: function() {
            const data = JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;
            
            if(data === null) this.clearCurrentGame();
            else{
                solution= (data.solution);
                guesses.push(...data.guesses);
                greenLetters.push(...data.greenLetters);
                orangeLetters.push(...data.orangeLetters);
                greyLetters.push(...data.greyLetters);
                disabledLetters.push(...data.disabledLetters);
            }
            saveCurrentGame();
        },
        setNewGame: (solWordLength) => {
            console.log('New Game:', solWordLength);
            solution = getNewSolutionWord(solWordLength);
            guesses.length = 0;
            greenLetters.length = 0;
            orangeLetters.length = 0;
            greyLetters.length = 0;
            disabledLetters.length = 0;
            saveCurrentGame();
        },
        setEmptyGame:() => {
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

    const numCorrectEl = document.createElement('div');
    numCorrectEl.className = 'border border-3 text-center rounded-circle flex-shrink-0 circle';
    currentGuessRowEl.appendChild(numCorrectEl);

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

const displayNumCorrectLetters = (numCorrect) => {
    const numCorrectEl = currentGuessRowEl.children[currentGuessRowEl.children.length -1];
    numCorrectEl.textContent = numCorrect;
    numCorrectEl.style.backgroundColor = 'darkgrey';
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

    currentGame.getGuesses().forEach(guess => {
        displayNewEmptyRow();
        displayLettersText(guess);
        displayNumCorrectLetters(calcNumCorrectLetters(guess));

        //TODO: add color changes to letters
    });
    
    displayNewEmptyRow();
}

/* Game Logic */
let curGuess = '';
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    if (k === 'delete' || k === 'backspace') {
        curGuess = curGuess.slice(0, -1);
        displayLettersText(curGuess);
        setCurGuessTextWhite();
        console.log(curGuess);
    } else if (k === 'enter') {
        if(curGuess.length === currentGame.getSolution().length){
            handleGuess(curGuess);
        }
    } else if (alphabet.includes(k) && curGuess.length < currentGame.getSolution().length) {
        curGuess += k;
        displayLettersText(curGuess);
        if(curGuess.length === currentGame.getSolution().length) {
            isValidWord(curGuess) ? setCurGuessTextWhite() : setGuessTextRed();
        }
        console.log(curGuess);
    }
}

const handleGuess = (guess) => {
    if(guess === currentGame.getSolution()){
        console.log('Correct word:', guess);
        currentGame.addGuess(guess);
        displayNumCorrectLetters(guess.length);
        curGuess = '';
        handleGameOver(true);
    }else if(isValidWord(guess)){
        console.log(`Valid word: ${guess}`);
        currentGame.addGuess(guess);
        displayNumCorrectLetters(calcNumCorrectLetters(guess));
        displayNewEmptyRow();
        curGuess = '';
    } else {
        console.log(`Invalid word: ${guess}`);
        //TODO: Display invalid word message/animation/something
    }

}

const calcNumCorrectLetters = (guess) => {
    let numCorrect = 0;
    const guessedLets = [];
    for(let i = 0; i < guess.length; i++){
        if(!guessedLets.includes(guess[i])){
            if(currentGame.getSolution().includes(guess[i])){
            numCorrect++;
            guessedLets.push(guess[i]);
            }
        }
    }
    return numCorrect;
}

const getNewSolutionWord = (solutionLength) => {
    // Solution word cannot have repeating letters
    let newSolution = '';
    let counter = 0;
    while (newSolution === '' && counter < 1000) {
        counter++;
        let solutionHelper = getRandomWord(solutionLength);
        // Search for repeated letters
        for(let i = 0; i < solutionHelper.length; i++) {
            if(solutionHelper.indexOf(solutionHelper[i]) !== solutionHelper.lastIndexOf(solutionHelper[i])){
                solutionHelper = '';
                break;
            }
        }
        newSolution = solutionHelper;
    }

    if(counter === 1000){ 
        console.error(`Solution Word of length ${solutionLength} not found after ${counter} tries`);
        return null
    }else{
        console.log(`Solution Word Found in ${counter} tries: ${newSolution}`);
        return newSolution;
    }
}

const startNewGame = (solutionLength) => {
    currentGame.setNewGame(solutionLength);

    setUI();
}

/* Event Listeners */
bodyEl.addEventListener('keydown', (event) => handleKeyPress(event.key));
newGameBtnEl.addEventListener('click', () => startNewGame(5));

/* Game Initialization */
loadWords().then(() => {
    initializeKeyboard();
    currentGame.loadCurrentGame();
    if(currentGame.getSolution() === null){
        //TODO: show modal to ask for new game
    }else{
        setUI();
    }
});