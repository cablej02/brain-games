const validWords = [];
const getRandomWord = () => validWords[Math.floor(Math.random() * validWords.length)];
const isValidWord = (word) => {
    let lo = 0;
    let hi = validWords.length - 1;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (validWords[mid] === word) {
            return true;
        } else if (validWords[mid] < word) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return false;
}

const loadWords = async () => {
    //clear validWords array
    validWords.length = 0;

    try{
        const response = await fetch('assets/word-list/words.csv');
        const text = await response.text();
        // May be overkill, but cleaning up the words to remove any extra spaces
        text.split(',').map(word => validWords.push(word.trim()));
        console.log('Loaded words from file:', validWords.length);
    } catch (error){
        console.error('Error loading words:', error);
        redirectPage('index.html');
    }
}

/* Keyboard Creation */
const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['DELETE','Z', 'X', 'C', 'V', 'B', 'N', 'M','ENTER'],
];

const keyboardContainer = document.createElement('div');
keyboardContainer.id = 'keyboard-container';
keyboardContainer.classList.add('container-fluid', 'text-center', 'px-2');
document.body.appendChild(keyboardContainer);

function createKeyboard() {
    keyboardLayout.forEach(row => {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('d-flex', 'justify-content-center', 'flex-nowrap', 'mb-2');

    row.forEach(key => {
        const keyButton = document.createElement('button');
        keyButton.textContent = key;
        keyButton.classList.add('btn', 'btn-secondary', 'm-1', 'btn-sm', 'flex-grow-0');

        if (key === 'ENTER') {
            //TODO: fix this
            //keyButton.innerHTML = `<img src="assets/svg/enter-icon.svg" alt="enter" class="enter-icon">`;
            keyButton.classList.add('w-75','enter-btn');
            keyButton.style.flexBasis = '75px';
            keyButton.style.alignSelf = 'stretch';
        }

        keyButton.addEventListener('click', () => handleKeyPress(key));

        keyboardRow.appendChild(keyButton);
    });

    keyboardContainer.appendChild(keyboardRow);
  });
}



//TODO: DELETE THIS EVENTUALLY
/* IMPLEMENT THIS METHOD TO USE THE KEYBOARD */
// const handleKeyPress = (key) => {
//     if (key === 'DELETE') {
//         console.log('Delete key pressed');
//     } else if (key === 'ENTER') {
//         console.log('Enter key pressed');
//     } else {
//         console.log('Letter key pressed:', key);
//     }
// }



