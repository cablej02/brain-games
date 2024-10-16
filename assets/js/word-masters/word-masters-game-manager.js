// STATICS
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const SOLUTION_LENGTH = 5;

const GameManager = (() => {
    let curGuess = '';
    const handleKeyPress = (key) => {
        const solution = CurrentGame.getSolution();
        if (document.activeElement) {
            document.activeElement.blur();
        }
        if(solution === null) return;
        let k = key.toLowerCase();
        if (k === 'delete' || k === 'backspace') {
            const rowId = CurrentGame.getGuesses().length;
            const letId = curGuess.length - 1;
            curGuess = curGuess.slice(0, -1);
            UI.displayLetter(`r${rowId}l${letId}`, '');
            UI.setCurGuessTextWhite(rowId);
        } else if (k === 'enter') {
            if(curGuess.length === solution.length){
                handleGuess(curGuess);
            }
        } else if (ALPHABET.includes(k) && curGuess.length < solution.length) {
            curGuess += k;
            const rowId = CurrentGame.getGuesses().length;
            const letId = curGuess.length - 1;
            UI.displayLetter(`r${rowId}l${letId}`, k);
            if(curGuess.length === solution.length) {
                wordList.isValidWord(curGuess) ? UI.setCurGuessTextWhite() : UI.setGuessTextRed();
            }
        }
    }

    const handleGuess = (guess) => {
        const solWord = CurrentGame.getSolution()
        if(guess === solWord){
            console.log('Correct word:', guess);
            CurrentGame.addGuess(guess);
            UI.displayNumCnMLetters(guess.length,0);
            curGuess = '';

            handleGameOver(true);
        }else if(CurrentGame.getGuesses().includes(guess)){
            console.log('Duplicate guess:', guess);
            UI.shakeCurrentGuessRow();
        }else if(wordList.isValidWord(guess)){
            console.log(`Valid word: ${guess}`);
            CurrentGame.addGuess(guess);
            const [numCorrect,numMisplaced] = calcNumCnMLetters(guess);
            if(numCorrect === 0 && numMisplaced === 0){
                //change all letters to grey and disable them
                [...guess].forEach(letter => {
                    handleLetterColorChangeTransparent(letter);
                    handleDisableLetter(letter);
            })};

            UI.displayNumCnMLetters(numCorrect,numMisplaced);
            UI.setCurrentGuessRowStateGuessed();
            UI.displayNewEmptyRow(solWord.length);
            curGuess = '';
        }else{
            console.log(`Invalid word: ${guess}`);
            UI.shakeCurrentGuessRow();
        }
    }

    const handleLetterColorChange = (target) => {
        const letter = target.textContent.toLowerCase();
        const index = target.id.slice(-1);
        if(ALPHABET.includes(letter)){
            const color = CurrentGame.changeLetterColor(letter,index);
            UI.setLetterBgColor(letter,color,index);
            keyboard.setKeyColor(letter,color);
        }
    }

    const handleLetterColorChangeTransparent = (target) => {
        const letter = target.textContent.toLowerCase();
        if(ALPHABET.includes(letter)){
            const color = CurrentGame.setLetterColorTransparent(letter);
            UI.setLetterBgColor(letter,color);
            keyboard.setKeyColorTransparent(letter);
        }
    }

    const handleDisableLetter = (letter) => {
        if(ALPHABET.includes(letter)){
            CurrentGame.addDisabledLetter(letter);
            UI.disableLetterClick(letter);
        }
    }

    // Calculate number of correct and misplaced letters
    const calcNumCnMLetters = (guess) => {
        let numCorrect = 0;
        let numMisplaced = 0;
        
        const solution = CurrentGame.getSolution();
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

    const handleModalBtnClick = () => {
        const solution = CurrentGame.getSolution();
        if(solution === null){
            startNewGame(SOLUTION_LENGTH)
        }else{
            UI.cancelGameModalTextEl.textContent = `Are you sure you want to end the current game?`;
            UI.cancelGameModal.show();
        }
    }

    const handleGameOver = (isWin) => {
        console.log('Game Over');
        const numGuesses = CurrentGame.getGuesses().length;
        const solution = CurrentGame.getSolution();
        CurrentGame.setEmptyGame();

        //make letters unclickable
        UI.guessContainerEl.querySelectorAll('.guess-row').forEach(row => {
            [...row.children].forEach(child => {
                child.classList.remove('pointer');
                child.setAttribute('data-btn-state','disabled');
            })
        });
    
        if(isWin){
            //make letters green
            [...UI.getCurrentGuessRowEl().children].slice(1, -1).forEach(letterEl => UI.setLetterElementBgColor(letterEl, 'green'));
            //[...solution].forEach(letter => setLetterBgColor(letter,'green')); //TODO: remove this line probably.  Old way of doing it, but not sure which design I want to go with
            UI.newGameModalTextEl.innerHTML = `Congratulations!<br>You Win!<br>Guesses: ${numGuesses}`
        }else{
            UI.newGameModalTextEl.innerHTML = `Nice try!<br>The word was:<br>${solution.toUpperCase()}<br>Guesses: ${numGuesses}`;
        }

        UI.newGameModal.show();
    }

    const startNewGame = (solutionLength) => {
        CurrentGame.setNewGame(solutionLength);
        curGuess = '';

        UI.setUI();
    }

    return {
        handleKeyPress,
        handleLetterColorChange,
        handleLetterColorChangeTransparent,
        calcNumCnMLetters,
        handleModalBtnClick,
        getNewSolutionWord,
        startNewGame,
        handleGameOver
    }
})();

const handleKeyPress = (key) => {
    GameManager.handleKeyPress(key);
}