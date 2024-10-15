const Init = (() => {
    wordList.loadWords().then(() => {
        keyboard.initialize();
    
        const headerHeight = document.querySelector('header').offsetHeight;
        const keyboardHeight = document.getElementById('keyboard-container').offsetHeight;
    
        const availHeight = window.innerHeight - headerHeight - keyboardHeight - 10;
        UI.guessContainerEl.style.maxHeight = `${availHeight}px`;

        CurrentGame.loadGame();
        if(CurrentGame.getSolution() === null){
            GameManager.startNewGame(SOLUTION_LENGTH);
        }else{
            UI.setUI();
        }
    });
})();