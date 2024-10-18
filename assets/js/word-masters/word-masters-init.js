// STATICS
const SOLUTION_LENGTH = 5;

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