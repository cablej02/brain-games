const CurrentGame = (() => {
    let solution = null;
    const guesses = [];
    const greenLetters = [];
    const yellowLetters = [];
    const greyLetters = [];
    const transparentLetters = [];
    const disabledLetters = [];
    const saveGame = () => {
        const curGameHelper = {
            solution,
            guesses,
            greenLetters,
            yellowLetters,
            greyLetters,
            transparentLetters,
            disabledLetters
        }
        localStorage.setItem('wordMastersCurGame', JSON.stringify(curGameHelper)) && console.log('Game saved');
    }
    return {
        loadGame: () => {
            const data = JSON.parse(localStorage.getItem('wordMastersCurGame')) || null;
            
            if(data === null) CurrentGame.setEmptyGame();
            else{
                solution= (data.solution);
                guesses.push(...data.guesses);
                greenLetters.push(...data.greenLetters);
                yellowLetters.push(...data.yellowLetters);
                greyLetters.push(...data.greyLetters);
                transparentLetters.push(...data.transparentLetters);
                disabledLetters.push(...data.disabledLetters);
            }
            saveGame();
        },
        setNewGame: (solWordLength) => {
            console.log('New Game:', solWordLength);
            solution = GameManager.getNewSolutionWord(solWordLength);
            guesses.length = 0;
            greenLetters.length = 0;
            yellowLetters.length = 0;
            greyLetters.length = 0;
            transparentLetters.length = 0;
            disabledLetters.length = 0;
            saveGame();
        },
        setEmptyGame:() => {
            solution = null;
            guesses.length = 0;
            greenLetters.length = 0;
            yellowLetters.length = 0;
            greyLetters.length = 0;
            transparentLetters.length = 0;
            disabledLetters.length = 0;
            saveGame();
        },
        //TODO: This seems like it can be improved
        changeLetterColor:(letter,index) => {
            if(greenLetters.includes(letter)){
                console.log(`GREEN LETTER FOUND: ${letter} input index: ${index} curgreenLetters: ${greenLetters} index of letter in data letter: ${greenLetters.indexOf(letter)}`);
                if(greenLetters.indexOf(letter) === parseInt(index)){
                    console.log('BEFORE GREEN REMOVAL greenLetters:', greenLetters, 'removing:', letter, 'index:', index);
                    greenLetters[index] = null;
                    console.log('AFTER greenLetters:', greenLetters);
                    transparentLetters.push(letter);
                    saveGame();
                    return 'transparent';
                }else{
                    console.log('BEFORE GREEN SHIFT greenLetters:', greenLetters, 'removing:', letter, 'index:', index);
                    greenLetters[greenLetters.indexOf(letter)] = null;
                    greenLetters[index] = letter;
                    console.log('AFTER greenLetters:', greenLetters);
                    saveGame();
                    return 'green';
                }                
            }else if(yellowLetters.includes(letter)){
                yellowLetters.splice(yellowLetters.indexOf(letter), 1);
                console.log('BEFORE YELLOW TO GREEN greenLetters:', greenLetters, 'adding:', letter, 'index:', index);
                greenLetters[index] = letter;
                console.log('AFTER greenLetters:', greenLetters);
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
            //wipe it out of all arrays and make sure it's in/added to the transparentLetters array
            if(greenLetters.includes(letter)) {
                console.log('BEFORE TP SHIFT greenLetters:', greenLetters, 'removing:', letter);
                greenLetters[greenLetters.indexOf(letter)] = '';
                console.log('AFTER TP SHIFT greenLetters:', greenLetters);
            }
            if(yellowLetters.includes(letter)) yellowLetters.splice(yellowLetters.indexOf(letter), 1);
            if(greyLetters.includes(letter)) greyLetters.splice(greyLetters.indexOf(letter), 1);

            if(!transparentLetters.includes(letter)){
                transparentLetters.push(letter);
            }
            saveGame();
            return 'transparent';
        },
        addDisabledLetter: (letter) => {
            if(!disabledLetters.includes(letter)) disabledLetters.push(letter);
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
        getTransparentLetters: () => [...transparentLetters],
        getDisabledLetters: () => [...disabledLetters],
    }
})();