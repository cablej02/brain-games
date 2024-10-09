





handleKeyPress = (key) => {
    if (key === 'DELETE') {
        console.log('Delete key pressed');
    } else if (key === 'ENTER') {
        console.log('Enter key pressed');
    } else {
        console.log('Letter key pressed:', key);
    }
}

createKeyboard();