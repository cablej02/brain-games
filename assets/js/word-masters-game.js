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
    const yellowLetters = [];
    const greyLetters = [];
    const transparentLetters = [];
    const saveCurrentGame = () => {
        const curGameHelper = {
            solution,
            guesses,
            greenLetters,
            yellowLetters,
            greyLetters,
            transparentLetters
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
                yellowLetters.push(...data.yellowLetters);
                greyLetters.push(...data.greyLetters);
                transparentLetters.push(...data.transparentLetters);
            }
            saveCurrentGame();
        },
        setNewGame: (solWordLength) => {
            console.log('New Game:', solWordLength);
            solution = getNewSolutionWord(solWordLength);
            guesses.length = 0;
            greenLetters.length = 0;
            yellowLetters.length = 0;
            greyLetters.length = 0;
            transparentLetters.length = 0;
            saveCurrentGame();
        },
        setEmptyGame:() => {
            solution = null;
            guesses.length = 0;
            greenLetters.length = 0;
            yellowLetters.length = 0;
            greyLetters.length = 0;
            transparentLetters.length = 0;
            saveCurrentGame();
        },
        //TODO: This seems like it can be improved
        changeLetterColor:(letter) => {
            if(greenLetters.includes(letter)){
                greenLetters.splice(greenLetters.indexOf(letter), 1);
                greyLetters.push(letter);
                saveCurrentGame();
                return 'grey';
            }else if(yellowLetters.includes(letter)){
                yellowLetters.splice(yellowLetters.indexOf(letter), 1);
                greenLetters.push(letter);
                saveCurrentGame();
                return 'green';
            }else if(greyLetters.includes(letter)){
                greyLetters.splice(greyLetters.indexOf(letter), 1);
                yellowLetters.push(letter);
                saveCurrentGame();
                return 'yellow';
            }else{
                greyLetters.push(letter);
                saveCurrentGame();
                return 'grey';
            }
        },        
        setLetterColorTransparent: (letter) => {
            if(greenLetters.includes(letter)) greenLetters.splice(greenLetters.indexOf(letter), 1);
            if(yellowLetters.includes(letter)) yellowLetters.splice(yellowLetters.indexOf(letter), 1);
            if(greyLetters.includes(letter)) greyLetters.splice(greyLetters.indexOf(letter), 1);
            transparentLetters.push(letter);
            saveCurrentGame()
        },
        getLetterColor:(letter) => {
            if(greenLetters.includes(letter)) return 'green';
            if(yellowLetters.includes(letter)) return 'yellow';
            if(transparentLetters.includes(letter)|| letter === '') return 'transparent';
            if(greyLetters.includes(letter)) return 'grey';
            greyLetters.push(letter);
            return 'grey';
        },
        getAllLetterColors:() => {
            return {
                greenLetters: [...greenLetters],
                yellowLetters: [...yellowLetters],
                greyLetters: [...greyLetters],
                transparentLetters: [...transparentLetters]
            }
        },
        addGuess: guess => (guesses.push(guess), saveCurrentGame()),
        // TODO: probably don't need these.  remove eventually
        // addGreenLetter: letter => (greenLetters.push(letter), saveCurrentGame()),
        // addOrangeLetter: letter => (yellowLetters.push(letter), saveCurrentGame()),
        // addGreyLetter: letter => (greyLetters.push(letter), saveCurrentGame()),
        // addDisabledLetters: letters => (disabledLetters.push(...letters), saveCurrentGame()),
        getSolution: () => solution,
        getGuesses: () => [...guesses],
        getGreenLetters: () => [...greenLetters],
        getyellowLetters: () => [...yellowLetters],
        getGreyLetters: () => [...greyLetters],
        getTransparentLetters: () => [...transparentLetters]
    }
})();

/* UI Functions */
let currentGuessRowEl = null;
const displayNewEmptyRow = () => {
    currentGuessRowEl = document.createElement('div');
    currentGuessRowEl.className = 'd-flex justify-content-center flex-nowrap';

    for(let i = 0; i < currentGame.getSolution().length; i++) {
        const letterBoxEl = document.createElement('div');
        letterBoxEl.setAttribute('id',`r${guessContainerEl.children.length}l${i}`);
        letterBoxEl.className = 'border border-3 fw-bold no-select text-center m-md-1 m-sm-0 flex-shrink-0 square';


        currentGuessRowEl.appendChild(letterBoxEl);
    };

    const numCorrectEl = document.createElement('div');
    numCorrectEl.className = 'border border-3 m-md-1 m-sm-0 fw-bold no-select text-center rounded-circle flex-shrink-0 circle';
    currentGuessRowEl.insertBefore(numCorrectEl, currentGuessRowEl.firstChild);

    const numMisplacedEl = document.createElement('div');
    numMisplacedEl.className = 'border border-3 m-md-1 m-sm-0 fw-bold no-select text-center rounded-circle flex-shrink-0 circle';
    currentGuessRowEl.appendChild(numMisplacedEl);

    guessContainerEl.appendChild(currentGuessRowEl);

}

const displayLetter = (id,letter) => {
    const letterBoxEl = document.getElementById(id);
    letterBoxEl.textContent = letter.toUpperCase();
    letterBoxEl.setAttribute('data-letter', letter.toLowerCase());
    setLetterElementBgColor(letterBoxEl,currentGame.getLetterColor(letter.toLowerCase()));
}

//TODO: maybe change how this is working.  pretty hacky
const setCurrentGuessRowStateGuessed = () => {
    if(currentGuessRowEl){
        [...currentGuessRowEl.children].forEach(child => {
            if(child.dataset.letter){
                child.classList.add('pointer');
                child.setAttribute('data-btn-state','active')
            }
        });
    }else{
        console.error('Cannot add letters to a null row element');
    }
}

//TODO: maybe change how this is working. May not work well with a different theme
const setLetterBgColor = (letter,color) => {
    const letterEls = guessContainerEl.querySelectorAll(`[data-letter="${letter}"]`);
    letterEls.forEach(el => setLetterElementBgColor(el,color));
}

const setLetterElementBgColor = (letterEl,color) => {
    const colorHelper = {
        green: 'success',
        yellow: 'warning',
        grey: 'secondary',
        transparent: 'transparent'
    };
    const bsColor = colorHelper[color] || 'secondary';
    letterEl.classList.forEach(className => {
        if(className.startsWith('bg-')){
            letterEl.classList.remove(className);
        }
    })
    letterEl.classList.add(`bg-${bsColor}`);
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

const setUI = () => {
    guessContainerEl.innerHTML = '';
    keyboard.resetKeys();

    const guesses = currentGame.getGuesses();
    for(let i = 0; i < guesses.length; i++){
        displayNewEmptyRow();
        for(let j = 0; j < guesses[i].length; j++){
            displayLetter(`r${i}l${j}`, guesses[i][j]);
        }
        const [numCorrect,numMisplaced] = calcNumCorrectAndMisplacedLetters(guesses[i]);
        displayNumCorrectAndMisplacedLetters(numCorrect,numMisplaced);
        setCurrentGuessRowStateGuessed();

    }
    const {greenLetters,yellowLetters,greyLetters} = currentGame.getAllLetterColors();
    greenLetters.forEach(letter => {
        setLetterBgColor(letter,'green');
        keyboard.setKeyColorGreen(letter);
    });
    yellowLetters.forEach(letter => {
        setLetterBgColor(letter,'yellow');
        keyboard.setKeyColorYellow(letter)});
    greyLetters.forEach(letter => {
        setLetterBgColor(letter,'grey');
        keyboard.setKeyColorGrey(letter)
    });
    
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
        displayNumCorrectAndMisplacedLetters(guess.length,0);
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
        setCurrentGuessRowStateGuessed();
        displayNewEmptyRow();
        curGuess = '';
    } else {
        console.log(`Invalid word: ${guess}`);
        //TODO: Display invalid word message/animation/something
    }
}

const handleLetterColorChange = (letter) => {
    if(alphabet.includes(letter)){
        const color = currentGame.changeLetterColor(letter);
        setLetterBgColor(letter,color);
        keyboard.setKeyColor(letter,color);
    }
}

const handleLetterColorChangeTransparent = (letter) => {
    if(alphabet.includes(letter)){
        const color = currentGame.setLetterColorTransparent(letter);
        setLetterBgColor(letter,color);
        keyboard.setKeyColorTransparent(letter);
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

const getSolutionLetter = () => {
    //TODO: add this as a hint to give a letter and make it always green
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

const handleGameOver = (isWin) => {
    //make letters unclickable

    //maybe change solution to all green and have board react like wordle would display

    //TODO: add modal to ask for new game
    if(isWin){
        gameOverTxtEl.textContent = 'Congratulations! You Win!';
        gameOverTxtEl.classList.add('text-success');
    }else{
        gameOverTxtEl.textContent = 'Game Over! You Lose!';
        gameOverTxtEl.classList.add('text-danger');
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
guessContainerEl.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if(event.target.dataset.btnState === 'active') handleLetterColorChangeTransparent(event.target.dataset.letter);
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