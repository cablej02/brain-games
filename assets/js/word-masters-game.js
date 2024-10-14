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
    const saveGame = () => {
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
        loadGame: () => {
            const data = JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;
            
            if(data === null) currentGame.setEmptyGame();
            else{
                solution= (data.solution);
                guesses.push(...data.guesses);
                greenLetters.push(...data.greenLetters);
                yellowLetters.push(...data.yellowLetters);
                greyLetters.push(...data.greyLetters);
                transparentLetters.push(...data.transparentLetters);
            }
            saveGame();
        },
        setNewGame: (solWordLength) => {
            console.log('New Game:', solWordLength);
            solution = getNewSolutionWord(solWordLength);
            guesses.length = 0;
            greenLetters.length = 0;
            yellowLetters.length = 0;
            greyLetters.length = 0;
            transparentLetters.length = 0;
            saveGame();
        },
        setEmptyGame:() => {
            solution = null;
            guesses.length = 0;
            greenLetters.length = 0;
            yellowLetters.length = 0;
            greyLetters.length = 0;
            transparentLetters.length = 0;
            saveGame();
        },
        //TODO: This seems like it can be improved
        changeLetterColor:(letter) => {
            if(greenLetters.includes(letter)){
                greenLetters.splice(greenLetters.indexOf(letter), 1);
                transparentLetters.push(letter);
                saveGame();
                return 'transparent';
            }else if(yellowLetters.includes(letter)){
                yellowLetters.splice(yellowLetters.indexOf(letter), 1);
                greenLetters.push(letter);
                saveGame();
                return 'green';
            }else if(greyLetters.includes(letter)){
                greyLetters.splice(greyLetters.indexOf(letter), 1);
                yellowLetters.push(letter);
                saveGame();
                return 'yellow';
            }else if(transparentLetters.includes(letter)){
                transparentLetters.splice(transparentLetters.indexOf(letter), 1);
                greyLetters.push(letter);
                saveGame();
                return 'grey';
            }else{
                greyLetters.push(letter);
                saveGame();
                return 'grey';
            }
        },        
        setLetterColorTransparent: (letter) => {
            if(greenLetters.includes(letter)) greenLetters.splice(greenLetters.indexOf(letter), 1);
            if(yellowLetters.includes(letter)) yellowLetters.splice(yellowLetters.indexOf(letter), 1);
            if(greyLetters.includes(letter)) greyLetters.splice(greyLetters.indexOf(letter), 1);
            if(transparentLetters.includes(letter)) return 'transparent';
            transparentLetters.push(letter);
            saveGame()
            return 'transparent';
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
        addGuess: guess => (guesses.push(guess), saveGame()),
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
    const existingRows = guessContainerEl.querySelectorAll('.guess-row');

    currentGuessRowEl = document.createElement('div');
    currentGuessRowEl.className = 'guess-row d-flex justify-content-center flex-nowrap';

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

    guessContainerEl.insertBefore(currentGuessRowEl, guessContainerEl.firstChild);

    // Animate existing rows down
    anime({
        targets: existingRows[0],
        translateY: [-50,0], // Move down
        translateX: 0, // Move down
        duration: 500, // Duration of animation
        easing: 'easeOutCubic', // Easing function
    });

    // Animate the new row sliding in from the top
    anime({
        targets: currentGuessRowEl,
        translateX: [-1000, 0], // Move from above to original position
        opacity: [0, 1], // Fade in
        duration: 500, // Duration of animation
        easing: 'easeOutCubic', // Easing function
    });
}

const displayLetter = (id,letter) => {
    const letterBoxEl = document.getElementById(id);
    if(letterBoxEl){
        letterBoxEl.textContent = letter.toUpperCase();
        letterBoxEl.setAttribute('data-letter', letter.toLowerCase());
        setLetterElementBgColor(letterBoxEl,currentGame.getLetterColor(letter.toLowerCase()));
    }
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

const displayNumCnMLetters = (numCorrect,numMisplaced) => {
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
        const [numCorrect,numMisplaced] = calcNumCnMLetters(guesses[i]);
        displayNumCnMLetters(numCorrect,numMisplaced);
        setCurrentGuessRowStateGuessed();

    }
    const {greenLetters,yellowLetters,greyLetters,transparentLetters} = currentGame.getAllLetterColors();
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
    transparentLetters.forEach(letter => {
        setLetterBgColor(letter,'transparent');
        keyboard.setKeyColorTransparent(letter)
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
        displayNumCnMLetters(guess.length,0);
        curGuess = '';
        handleGameOver(true);
    }else if(currentGame.getGuesses().includes(guess)){
        console.log('Duplicate guess:', guess);
    }else if(wordList.isValidWord(guess)){
        console.log(`Valid word: ${guess}`);
        currentGame.addGuess(guess);
        const [numCorrect,numMisplaced] = calcNumCnMLetters(guess);
        //if(numCorrect === 0) currentGame.addDisabledLetters(guess);
        displayNumCnMLetters(numCorrect,numMisplaced);
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

// Calculate number of correct and misplaced letters
const calcNumCnMLetters = (guess) => {
    let numCorrect = 0;
    let numMisplaced = 0;
    
    const solution = currentGame.getSolution();
    const guessedLetsRemainder = [];
    const solutionLetsRemainder = [];

    // count correct letters and store remaining letters
    for (let i = 0; i < guess.length; i++) {
        if (solution[i] === guess[i]) {
            numCorrect++;
        } else {
            solutionLetsRemainder.push(solution[i]);
            guessedLetsRemainder.push(guess[i]);
        }
    }

    // count misplaced letters from remaining guess letters
    for (let i = 0; i < guessedLetsRemainder.length; i++) {
        const letter = guessedLetsRemainder[i];
        const pos = solutionLetsRemainder.indexOf(letter);
        if (pos !== -1) {
            numMisplaced++;
            solutionLetsRemainder.splice(pos, 1);
        }
    }

    return [numCorrect, numMisplaced];
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
    currentGame.setEmptyGame();
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
    curGuess = '';

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
    currentGame.loadGame();
    if(currentGame.getSolution() === null){
        //TODO: show modal to ask for new game
    }else{
        setUI();
    }
});