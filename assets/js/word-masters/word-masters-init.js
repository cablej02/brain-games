// STATICS
const SOLUTION_LENGTH = 5;
const URL_BASE = 'https://cablej02.github.io/brain-games/word-masters.html?word='

const encodeSolutionWord = (word) => {
    return btoa(word);
}

const decodeSolutionWord = (word) => {
    return atob(word);
}

const initGame = () => {
    wordList.loadWords(GAME_TYPE.WORD_MASTERS).then(() => {
        keyboard.initialize();
        UI.setGuessContainerHeight();

        //get the solution word from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const word = urlParams.get('word');
        if(word){
            const decodedWord = decodeSolutionWord(word);
            if(decodedWord.length === SOLUTION_LENGTH){
                console.log(`Starting new game with solution word: ${decodedWord}`);
                GameManager.startNewGame(decodedWord);
            }else{
                console.error(`Invalid solution word length: ${decodedWord.length}`);
            }
        }else{
            CurrentGame.loadGame();
            if(CurrentGame.getSolution() === null || CurrentGame.getSolution().length !== SOLUTION_LENGTH){
                GameManager.startNewGame(GameManager.getNewSolutionWord(SOLUTION_LENGTH));
            }else{
                UI.setUI();
            }
        }
    });
}

initGame();