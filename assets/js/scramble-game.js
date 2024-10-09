
//Display functions



//Gameplay logic



//Event listeners

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
    createKeyboard();
    //load game/start new game

});


