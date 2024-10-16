
// const wordText = document.querySelector(".word");
// hintText = document.querySelector(".hint span")
// timeText = document.querySelector(".time b")
// inputField = document.querySelector("input")
// newGameBtn = document.querySelector(".newGameBtn")
// checkBtn = document.querySelector(".check-word")
// contentBox = document.querySelector(".container .content")
// startArea = document.querySelector(".startArea")
// scoreArea = document.querySelector(".score")
// endScreenContent = document.querySelector(".end-screen-content")

// var endScreen = document.getElementById("end-screen")
// var endScreenText = document.getElementById("end-screen-text")



// let correctWord, timer;
// let score = 0;
// //timer function
// const initTimer = maxTime => {
//     clearInterval(timer);
//     timer = setInterval(() => {
//     if(maxTime > 0){
//         maxTime--;
//         return timeText.innerText = maxTime;
//     }
//     endGame();
//     }, 1000);
// }

// const start = () => {
//     initGame();
// }

// const endGame = () => {
//     clearInterval(timer);
//     contentBox.style.display = "none";
//     endScreen.style.display = "block"
//     endScreenContent.classList.remove("endScreen-correct")
//     endScreenContent.classList.add("endScreen-wrong")
//     endScreenText.innerHTML = `<p> Game Over </p>`
    
// }

// const winGame = () =>{
//     contentBox.style.display = "none";
//     endScreen.style.display = "block"
//     endScreenContent.classList.add("endScreen-correct")
//     endScreenContent.classList.remove("endScreen-wrong")
//     endScreenText.innerHTML = `<p> You Win!</p>`
// }

// const initGame =  () => {
//     initTimer(30);
//     let randomObj = words[Math.floor(Math.random() * words.length)];
//     let wordArray = randomObj.word.split("");
//     for(let i = wordArray.length -1; i > 0; i--){
//         let j = Math.floor(Math.random() * (i +1));
//         [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
//     }
//     wordText.innerText = wordArray.join("");
//     hintText.innerText = randomObj.hint;
//     correctWord = randomObj.word.toLowerCase();
//     inputField.value = "";
//     inputField.setAttribute("maxlength", correctWord.length);
//     scoreArea.innerHTML = score;

//     if(score > 9){
//         winGame();
//     }
// }

// const checkWord = () => {
//     let userWord = inputField.value.toLowerCase();

//     if(!userWord){
//         endScreen.style.display = 'block'
//     }
// }

// currentGame = {

// }

// handleKeyPress = (key) => {
//     if (key === 'DELETE') {
//         console.log('Delete key pressed');
//     } else if (key === 'ENTER') {
//         console.log('Enter key pressed');
//     } else {
//         console.log('Letter key pressed:', key);
//     }
// }



// //Initialize game
// loadWords().then(() => {
//     //createKeyboard();
//     //load game/start new game

// });
const SOLUTION_LENGTH = 5;
const MAX_TIME = 30;

const tileContainerEl = document.getElementById('tile-container');
const submitBtnEl = document.getElementById('submit-btn');
const newGameBtnEl = document.getElementById('new-game-btn');
const resultEl = document.getElementById('result');
const bodyEl = document.querySelector('body');

const currentGame = (()=>{
    let solution = null;
    let timeLeft = 0;
    const saveData = () => {
        const curGameHelper = {
            solution,
            timeLeft
        }
        localStorage.setItem('scrambleGameCurGame', JSON.stringify(curGameHelper));
    }
    const loadData = () => {
        const data = JSON.parse(localStorage.getItem('scrambleGameCurGame')) || null;
        if(data === null){
            clearGame();
        }else{
            solution = data.solution;
            timeLeft = data.timeLeft;
        }
        return timeLeft;
    }
    const setNewGame = (newSolWord,newTimeLeft) => {
        solution = newSolWord;
        timeLeft = newTimeLeft;
        saveData();
        return timeLeft;
    }
    const clearGame = () => {
        solution = null;
        timeLeft = 0;
        saveData();
    }
    return{
        getSolution: () => solution,
        getTimeLeft: () => timeLeft,
        setNewGame,
        clearGame,
        loadData,
    }
})();

/* UI functions */
// initialize sortable
const sortable = new Sortable(tileContainerEl, {
    animation: 300,  // Animation speed (ms) for drag transitions
    ghostClass: 'sortable-ghost'  // Class for the dragging item
});


const getGuess = () => {
    let guess = ''
    const tiles = document.querySelectorAll('.tile');
    console.log(`current tiles: ${tiles}`);
    for (let i = 0; i < tiles.length; i++) {    
        guess += tiles[i].innerText;
    }
    return guess;
}

const setUI = (timeLeft) => {
    // clear out any existing tiles
    tileContainerEl.innerHTML = '';

    // get shuffled solution word
    const shuffledWord = shuffle();

    for(let i = 0; i < shuffledWord.length; i++){
        //create new tiles
        const tile = document.createElement('span');

        //set new tile properties/classes/etc
        tile.classList = 'tile bg-secondary rounded p-2 m-1'
        tile.innerText = shuffledWord[i];

        //append tiles to tileContainer
        tileContainerEl.appendChild(tile);
    }


    //TODO: set timeLeft

}

/* Game Logic */
const handleGuess = () => {
    const guess = getGuess();
    if(guess === currentGame.getSolution()){
        handleGameOver(true);
    }else{
        resultEl.innerText = 'Try again!';
    }
}
const shuffle = () => {
    const solution = currentGame.getSolution();
    let shuffledSolWord = null;

    while(shuffledSolWord === null){
        let wordArray = solution.split("");
        for(let i = wordArray.length -1; i > 0; i--){
            //i = 4,3,2,1
            let j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        const result = wordArray.join("");
        console.log(`result: ${result} solution: ${solution}`);

        if(result !== solution){
            shuffledSolWord = result;
        }
    }

    return shuffledSolWord;
}


// const initTimer = (maxTime) => {
//     clearInterval(timeLeft);
//     timeLeft = setInterval(() => {
//     if(maxTime > 0){
//         maxTime--;
//         return timeText.innerText = maxTime;
//     }
//     endGame();
//     }, 1000);
// }

const handleGameOver = (winBool) => {
    if(winBool){
        resultEl.innerText = 'You win!';
    }else{
        resultEl.innerText = 'You lose!';
    }
    currentGame.clearGame();
}

const startGame = (SOLUTION_LENGTH) => {
    const randomWord = wordList.getRandomWord(SOLUTION_LENGTH);
    const timeLeft = currentGame.setNewGame(randomWord, MAX_TIME);

    setUI(timeLeft);
}

/* Event Listeners */
newGameBtnEl.addEventListener('click', () => startGame(SOLUTION_LENGTH));
submitBtnEl.addEventListener('click',handleGuess);
bodyEl.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'enter') {
        handleGuess();
    }
});

/* Initialize game */
wordList.loadWords().then(() => {


});