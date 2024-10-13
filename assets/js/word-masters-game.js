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
        loadCurrentGame: () => {
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
        letterBoxEl.setAttribute('id',`r${guessContainerEl.children.length}l${i}`);
        letterBoxEl.className = 'border border-3 fw-bold text-center m-md-1 m-sm-0 flex-shrink-0 square';


        currentGuessRowEl.appendChild(letterBoxEl);
    };

    const numCorrectEl = document.createElement('div');
    numCorrectEl.className = 'border border-3 fw-bold text-center rounded-circle flex-shrink-0 circle';
    currentGuessRowEl.insertBefore(numCorrectEl, currentGuessRowEl.firstChild);

    const numMisplacedEl = document.createElement('div');
    numMisplacedEl.className = 'border border-3 fw-bold text-center rounded-circle flex-shrink-0 circle';
    currentGuessRowEl.appendChild(numMisplacedEl);

    guessContainerEl.appendChild(currentGuessRowEl);

}

const displayLetter = (id,letter) => {
    const letterBoxEl = document.getElementById(id);
    letterBoxEl.textContent = letter.toUpperCase();
    letterBoxEl.setAttribute('data-letter', letter.toLowerCase());
    setLetterBgColor(letterBoxEl);
}

//TODO: maybe change how this is working.  pretty hacky
const setCurrentGuessRowStateGuessed = () => {
    if(currentGuessRowEl){
        [...currentGuessRowEl.children].forEach(child => {
            if(child.dataset.letter){
                console.log(`Checking letter: ${child.dataset.letter} against disabled letters: ${currentGame.getDisabledLetters()}`);
                if(!currentGame.getDisabledLetters().includes(child.dataset.letter)) {
                    console.log('active');
                    child.classList.add('pointer');
                    child.setAttribute('data-btn-state','active')
                }else{
                    console.log('disabled');
                    child.setAttribute('data-btn-state','disabled');
                }
            }
        });
    }else{
        console.error('Cannot add letters to a null row element');
    }
}

const setLetterBgColor = (letterBoxEl) => {

}

const displayNumCorrectAndMisplacedLetters = (numCorrect,numMisplaced) => {
    const numCorrectEl = currentGuessRowEl.children[0];
    numCorrectEl.textContent = numCorrect;
    numCorrectEl.classList.add('bg-success');

    const numMisplacedEl = currentGuessRowEl.children[currentGuessRowEl.children.length - 1];
    numMisplacedEl.textContent = numMisplaced;
    numMisplacedEl.classList.add('bg-warning');
}

const setGuessTextRed = () => {
    if(currentGuessRowEl){
        for(let i = 0; i < currentGuessRowEl.children.length; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            letterBoxEl.classList.remove('custom-body-color');
            letterBoxEl.classList.add('text-danger');
        }
    }else{
        console.error('Cannot add letters to a null row element');
    }
}

const setCurGuessTextWhite = () => {
    if(currentGuessRowEl){
        for(let i = 0; i < currentGuessRowEl.children.length; i++) {
            const letterBoxEl = currentGuessRowEl.children[i];
            letterBoxEl.classList.remove('text-danger');
            letterBoxEl.classList.add('custom-body-color');
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

    const guesses = currentGame.getGuesses();
    for(let i = 0; i < guesses.length; i++){
        displayNewEmptyRow();
        for(let j = 0; j < guesses[i].length; j++){
            displayLetter(`r${i}l${j}`, guesses[i][j]);
        }
        const [numCorrect,numMisplaced] = calcNumCorrectAndMisplacedLetters(guesses[i]);
        displayNumCorrectAndMisplacedLetters(numCorrect,numMisplaced);
        setCurrentGuessRowStateGuessed
    }
    
    displayNewEmptyRow();
}

/* Game Logic */
let curGuess = '';
const alphabet = 'abcdefghijklmnopqrstuvwxyz'; //TODO: move to global constants
const handleKeyPress = (key) => {
    let k = key.toLowerCase();
    if (k === 'delete' || k === 'backspace') {
        const rowId = currentGame.getGuesses().length;
        const letId = curGuess.length - 1;
        curGuess = curGuess.slice(0, -1);
        displayLetter(`r${rowId}l${letId}`, '');
        setCurGuessTextWhite(rowId);
        console.log(curGuess);
    } else if (k === 'enter') {
        if(curGuess.length === currentGame.getSolution().length){
            handleGuess(curGuess);
        }
    } else if (alphabet.includes(k) && curGuess.length < currentGame.getSolution().length) {
        curGuess += k;
        const rowId = currentGame.getGuesses().length;
        const letId = curGuess.length - 1;
        displayLetter(`r${rowId}l${letId}`, k);
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
    }else if(currentGame.getGuesses().includes(guess)){
        console.log('Duplicate guess:', guess);
    }else if(wordList.isValidWord(guess)){
        console.log(`Valid word: ${guess}`);
        currentGame.addGuess(guess);
        const [numCorrect,numMisplaced] = calcNumCorrectAndMisplacedLetters(guess);
        //if(numCorrect === 0) currentGame.addDisabledLetters(guess);
        displayNumCorrectAndMisplacedLetters(numCorrect,numMisplaced);
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

const calcNumCorrectAndMisplacedLetters = (guess) => {
    let numCorrect = 0;
    let numMisplaced = 0;
    const guessedLets = [];
    for(let i = 0; i < guess.length; i++){
        if(!guessedLets.includes(guess[i])){
            if(currentGame.getSolution()[i] === guess[i]){
                numCorrect++;
                guessedLets.push(guess[i]);
            }else if(currentGame.getSolution().includes(guess[i])){
            numMisplaced++;
            guessedLets.push(guess[i]);
            }
        }
    }
    return [numCorrect,numMisplaced];
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
guessContainerEl.addEventListener('click', (event) => {
    if(event.target.dataset.btnState === 'active') handleLetterColorChange(event.target.dataset.letter);
});

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