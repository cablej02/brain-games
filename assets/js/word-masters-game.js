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
            
            if(data === null) this.setEmptyGame();
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
        changeLetterColor:(letter) => {
            if(greenLetters.includes(letter)){
                greenLetters.splice(greenLetters.indexOf(letter), 1);
                orangeLetters.push(letter);
            }else if(orangeLetters.includes(letter)){
                orangeLetters.splice(orangeLetters.indexOf(letter), 1);
                greyLetters.push(letter);
            }else if(greyLetters.includes(letter)){
                greyLetters.splice(greyLetters.indexOf(letter), 1);
            }else{
                greenLetters.push(letter);
            }
            saveCurrentGame();
        },

        addGuess: guess => (guesses.push(guess), saveCurrentGame()),
        addGreenLetter: letter => (greenLetters.push(letter), saveCurrentGame()),
        addOrangeLetter: letter => (orangeLetters.push(letter), saveCurrentGame()),
        addGreyLetter: letter => (greyLetters.push(letter), saveCurrentGame()),
        addDisabledLetters: letters => (disabledLetters.push(...letters), saveCurrentGame()),
        getSolution: () => solution,
        getGuesses: () => [...guesses],
        getGreenLetters: () => [...greenLetters],
        getOrangeLetters: () => [...orangeLetters],
        getGreyLetters: () => [...greyLetters],
        getDisabledLetters: () => {
            console.log('Disabled Letters:', disabledLetters);
            return [...disabledLetters]
        }
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

const displayLetters = (letters) => {
    if(currentGuessRowEl){
        for(let i = 0; i < currentGuessRowEl.children.length - 1; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            if(i < letters.length){
                letterBoxEl.textContent = letters[i].toUpperCase();
                letterBoxEl.setAttribute('data-letter', letters[i].toLowerCase());
                setLetterBgColor(letterBoxEl);
            }else{
                letterBoxEl.textContent = '';
                letterBoxEl.setAttribute('data-letter', '');
            }
        }
    }else{
        console.error('Cannot add letters to a null row element');
    }
}
const setCurrentGuessRowStateGuessed = () => {
    if(currentGuessRowEl){
        [...currentGuessRowEl.children].forEach(child => {
            if(child.dataset.letter){
                console.log(`Checking letter: ${child.dataset.letter} against disabled letters: ${currentGame.getDisabledLetters()}`);
                if(!currentGame.getDisabledLetters().includes(child.dataset.letter)) {
                    console.log('active');
                    child.classList.add('guessed')
                }else{
                    console.log('disabled');
                    child.classList.add('guessed-disabled');
                }
            }
        });
        //TODO: maybe change how this is working.  pretty hacky

    }else{
        console.error('Cannot add letters to a null row element');
    }
}

const setLetterBgColor = (letterBoxEl) => {

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

const setLetterBgColorGreen = (letter) => {
    [...guessContainerEl.querySelectorAll(`[data-letter="${letter}"]`)].map(el => el.style.backgroundColor = 'green');
}


const setUI = () => {
    guessContainerEl.innerHTML = '';

    currentGame.getGuesses().forEach(guess => {
        displayNewEmptyRow();
        displayLetters(guess);
        displayNumCorrectLetters(calcNumCorrectLetters(guess));
        setCurrentGuessRowStateGuessed();

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
        displayLetters(curGuess);
        setCurGuessTextWhite();
        console.log(curGuess);
    } else if (k === 'enter') {
        if(curGuess.length === currentGame.getSolution().length){
            handleGuess(curGuess);
        }
    } else if (alphabet.includes(k) && curGuess.length < currentGame.getSolution().length) {
        curGuess += k;
        displayLetters(curGuess);
        if(curGuess.length === currentGame.getSolution().length) {
            wordList.isValidWord(curGuess) ? setCurGuessTextWhite() : setGuessTextRed();
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
    }else if(wordList.isValidWord(guess)){
        console.log(`Valid word: ${guess}`);
        currentGame.addGuess(guess);
        const numCorrect = calcNumCorrectLetters(guess);
        if(numCorrect === 0) currentGame.addDisabledLetters(guess);
        displayNumCorrectLetters(numCorrect);
        displayNewEmptyRow();
        curGuess = '';
    } else {
        console.log(`Invalid word: ${guess}`);
        //TODO: Display invalid word message/animation/something
    }
}

const handleLetterColorChange = (letter) => {
    if(alphabet.includes(letter) && !currentGame.getDisabledLetters().includes(letter)){
        currentGame.changeLetterColor(letter);
        setLetterBgColor(letter);
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
        let solutionHelper = wordList.getRandomWord(solutionLength);
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
newGameBtnEl.addEventListener('click', () => startNewGame(5)); //TODO: add slider to select word length
guessContainerEl.addEventListener('click', (event) => handleLetterColorChange(event.target.dataset.letter));

/* Game Initialization */
wordList.loadWords().then(() => {
    keyboard.initialize();
    currentGame.loadCurrentGame();
    if(currentGame.getSolution() === null){
        //TODO: show modal to ask for new game
    }else{
        setUI();
    }
});