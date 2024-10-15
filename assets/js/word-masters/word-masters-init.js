const Init = (() => {
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
})();