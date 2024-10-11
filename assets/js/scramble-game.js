
const wordText = document.querySelector(".word");
hintText = document.querySelector(".hint span")
timeText = document.querySelector(".time b")
inputField = document.querySelector("input")
newGameBtn = document.querySelector(".newGameBtn")
checkBtn = document.querySelector(".check-word")
contentBox = document.querySelector(".container .content")
startArea = document.querySelector(".startArea")
scoreArea = document.querySelector(".score")
endScreenContent = document.querySelector(".end-screen-content")

var endScreen = document.getElementById("end-screen")
var endScreenText = document.getElementById("end-screen-text")



let correctWord, timer;
let score = 0;
//timer function
const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
    if(maxTime > 0){
        maxTime--;
        return timeText.innerText = maxTime;
    }
    endGame();
    }, 1000);
}

const start = () => {
    initGame();
}

const endGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";
    endScreen.style.display = "block"
    endScreenContent.classList.remove("endScreen-correct")
    endScreenContent.classList.add("endScreen-wrong")
    endScreenText.innerHTML = `<p> Game Over </p>`
    
}

const winGame = () =>{
    contentBox.style.display = "none";
    endScreen.style.display = "block"
    endScreenContent.classList.add("endScreen-correct")
    endScreenContent.classList.remove("endScreen-wrong")
    endScreenText.innerHTML = `<p> You Win!</p>`
}

const initGame =  () => {
    initTimer(30);
    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    for(let i = wordArray.length -1; i > 0; i--){
        let j = Math.floor(Math.random() * (i +1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
    scoreArea.innerHTML = score;

    if(score > 9){
        winGame();
    }
}



currentGame = {

}

handleKeyPress = (key) => {
    if (key === 'DELETE') {
        console.log('Delete key pressed');
    } else if (key === 'ENTER') {
        console.log('Enter key pressed');
    } else {
        console.log('Letter key pressed:', key);
    }
}



//Initialize game
loadWords().then(() => {
    //createKeyboard();
    //load game/start new game

});


