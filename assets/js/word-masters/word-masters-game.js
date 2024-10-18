const CurrentGame = (() => {
    let solution = null;
    const guesses = [];
    const greenLetters = [];
    const yellowLetters = [];
    const greyLetters = [];
    const transparentLetters = [];
    const disabledLetters = [];
    const saveGame = () => {
        const curGameState = getCurrentGameState();
        localStorage.setItem('wordMastersCurGame', JSON.stringify(curGameState));
    }
    const loadGame = () => {
        const data = JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;
        
        if(data === null) CurrentGame.setEmptyGame();
        else{
            solution = (data.solution);
            guesses.push(...data.guesses);
            greenLetters.push(...data.greenLetters);
            yellowLetters.push(...data.yellowLetters);
            greyLetters.push(...data.greyLetters);
            transparentLetters.push(...data.transparentLetters);
            disabledLetters.push(...data.disabledLetters);
        }
        saveGame();
        return data;
    }
    const setNewGame = (solWordLength) => {
        console.log('New Game:', solWordLength);
        solution = GameManager.getNewSolutionWord(solWordLength);
        guesses.length = 0;
        greenLetters.length = 0;
        yellowLetters.length = 0;
        greyLetters.length = 0;
        transparentLetters.length = 0;
        disabledLetters.length = 0;
        saveGame();
    }
    const setEmptyGame = () => {
        solution = null;
        guesses.length = 0;
        greenLetters.length = 0;
        yellowLetters.length = 0;
        greyLetters.length = 0;
        transparentLetters.length = 0;
        disabledLetters.length = 0;
        saveGame();
    }
    const getCurrentGameState = () => {
        const curGameState = {
            solution,
            guesses,
            greenLetters,
            yellowLetters,
            greyLetters,
            transparentLetters,
            disabledLetters
        }
        return curGameState;
    }

    const addGuess = (guess) => {
        guesses.push(guess);
        saveGame();
    }
    
    const changeLetterColor =(letter,index) => {
        let color = '';
        if(greenLetters.includes(letter)){
            if(greenLetters.indexOf(letter) === parseInt(index)){
                color = setLetterColorTransparent(letter);
            }else{
                color = setLetterColorGreen(letter,index);
            }
        }else if(yellowLetters.includes(letter)){
            color = setLetterColorGreen(letter,index);
        }else if(greyLetters.includes(letter)){
            color = setLetterColorYellow(letter);
        }else{
            color = setLetterColorGrey(letter);
        }
        return color;
    }
    const setLetterColorGreen = (letter,index) => {
        clearLetterColor(letter);

        const currLetterAtIndex = greenLetters[index];
        if(currLetterAtIndex !== null && currLetterAtIndex !== undefined && currLetterAtIndex !== ''){   
            GameManager.resetLetterColor(currLetterAtIndex);
            greenLetters[index] = letter;
        }else{
            greenLetters[index] = letter;
        }
        saveGame();
        return Color.GREEN;
    }
    const setLetterColorYellow = (letter) => {
        clearLetterColor(letter);
        yellowLetters.push(letter);
        saveGame();
        return Color.YELLOW;
    }
    const setLetterColorGrey = (letter) => {
        clearLetterColor(letter);
        greyLetters.push(letter);
        saveGame();
        return Color.GREY;
    }
    const setLetterColorTransparent = (letter) => {
        clearLetterColor(letter);
        transparentLetters.push(letter);
        saveGame();
        return Color.TRANSPARENT;
    }
    const addDisabledLetter = (letter) => {
        if(!disabledLetters.includes(letter)) disabledLetters.push(letter);
    }
    const clearLetterColor = (letter) => {
        if(greenLetters.includes(letter)) greenLetters[greenLetters.indexOf(letter)] = null;
        if(yellowLetters.includes(letter)) yellowLetters.splice(yellowLetters.indexOf(letter), 1);
        if(greyLetters.includes(letter)) greyLetters.splice(greyLetters.indexOf(letter), 1);
        if(transparentLetters.includes(letter)) transparentLetters.splice(transparentLetters.indexOf(letter), 1);
    }
    const getLetterColor = (letter) => {
        if(greenLetters.includes(letter)) return Color.GREEN;
        if(yellowLetters.includes(letter)) return Color.YELLOW;
        if(transparentLetters.includes(letter)|| letter === '') return Color.TRANSPARENT;
        if(greyLetters.includes(letter)) return Color.GREY;
        greyLetters.push(letter);
        return Color.GREY;
    }
    const getAllLetterColors = () => {
        return {
            greenLetters: [...greenLetters],
            yellowLetters: [...yellowLetters],
            greyLetters: [...greyLetters],
            transparentLetters: [...transparentLetters]
        }
    }
    return {
        loadGame,
        setNewGame,
        setEmptyGame,
        addGuess,
        changeLetterColor,
        setLetterColorTransparent,
        setLetterColorGrey,
        addDisabledLetter,
        getLetterColor,
        getAllLetterColors,

        getSolution: () => solution,
        getGuesses: () => [...guesses],
        getGreenLetters: () => [...greenLetters],
        getyellowLetters: () => [...yellowLetters],
        getGreyLetters: () => [...greyLetters],
        getTransparentLetters: () => [...transparentLetters],
        getDisabledLetters: () => [...disabledLetters],
    }
})();