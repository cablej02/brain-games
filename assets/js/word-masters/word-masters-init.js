// STATICS
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const SOLUTION_LENGTH = 5;

const Color = {
    GREEN: 'green',
    YELLOW: 'yellow',
    GREY: 'grey',
    TRANSPARENT: 'transparent'
}

const initGame = () => {
    wordList.loadWords().then(() => {
        keyboard.initialize();
        UI.setGuessContainerHeight();
        
        CurrentGame.loadGame();
        if(CurrentGame.getSolution() === null){
            GameManager.startNewGame(SOLUTION_LENGTH);
        }else{
            UI.setUI();
        }
    });
}

initGame();