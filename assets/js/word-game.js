const validWords = {};
const getRandomWord = (length = 5) => {
    const validWordsByLength = validWords[length] || [];
    if(validWordsByLength.length > 0){
        return validWordsByLength[Math.floor(Math.random() * validWordsByLength.length)];
    }else{
        console.error(`No words of length ${length} found`)
        return null;
    }
}
const isValidWord = (word) => {
    const validWordsByLength = validWords[word.length] || [];
    let lo = 0;
    let hi = validWordsByLength.length - 1;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (validWordsByLength[mid] === word) {
            return true;
        } else if (validWordsByLength[mid] < word) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return false;
}

const loadWords = async () => {
    //clear validWords array
    for (let i in validWords) {
        validWords[i] = [];
    }

    try{
        const response = await fetch('assets/word-list/words.csv');
        const text = await response.text();
        let i = 0;
        text.split(',').map(word => {
            if (!validWords[word.length]) {
                validWords[word.length] = [];
            }
            validWords[word.length].push(word);
            i++;
        });
        console.log('Loaded words from file:', i);
    } catch (error){
        console.error('Error loading words:', error);
    }
}

/* Keyboard Functions */
const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['DELETE','Z', 'X', 'C', 'V', 'B', 'N', 'M','ENTER'],
];

const keyboardContainer = document.createElement('div');
keyboardContainer.id = 'keyboard-container';
keyboardContainer.classList.add('container-fluid','text-center','p-3','position-fixed','bottom-0','w-100', 'bg-dark');
keyboardContainer.style.zIndex = '1050';
document.body.appendChild(keyboardContainer);

const initializeKeyboard = (displayEnterAndDeleteBool=true) => {
    keyboardLayout.forEach(row => {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('d-flex','justify-content-center','flex-nowrap','mb-2');

    row.forEach(key => {
        const keyButton = document.createElement('button');
        keyButton.textContent = key;
        keyButton.classList.add('key-btn','btn','btn-secondary', 'm-1','btn-sm','flex-grow-0');
        keyButton.id = `key-${key.toLowerCase()}`;

        if (key === 'ENTER' || key === 'DELETE') {
            if(displayEnterAndDeleteBool){
                //TODO: fix this
                //keyButton.innerHTML = `<img src="assets/svg/enter-icon.svg" alt="enter" class="enter-icon">`;
                keyButton.classList.add('w-75','big-key-btn');
                keyButton.classList.remove('key-btn');
                keyButton.style.flexBasis = '75px';
                keyButton.style.alignSelf = 'stretch';
            }else{
                keyButton.style.display = 'none';
            }
        }

        keyButton.addEventListener('click', () => handleKeyPress(key));

        keyboardRow.appendChild(keyButton);
    });

    keyboardContainer.appendChild(keyboardRow);
  });
}

const setKeyColorGreen = (key) => setKeyColor(key, 'success');
const setKeyColorOrange = (key) => setKeyColor(key, 'warning');
const setKeyColorGrey = (key) => setKeyColor(key, 'secondary');
const setKeyColorRed = (key) => setKeyColor(key, 'danger');
const setKeyColorTransparent = (key) => setKeyColor(key, 'transparent');
const setKeyColorWhite = (key) => setKeyColor(key, 'light');
const setKeyColorBlue = (key) => setKeyColor(key, 'primary');

const setKeyColor = (key, color) => {
    if(key.toLowerCase() !== 'delete' && key.toLowerCase() !== 'enter' && key.toLowerCase() !== 'backspace'){
        const keyButton = document.getElementById(`key-${key.toLowerCase()}`);
        if(keyButton){
            //clear all bg- classes
            keyButton.classList.forEach((className) => {
                if (className.startsWith('bg-')) {
                    keyButton.classList.remove(className);
                }
            });
            keyButton.classList.add(`bg-${color}`);
        }
    }
}

const disableKey = (key) => {
    if(key.toLowerCase() !== 'delete' && key.toLowerCase() !== 'enter' && key.toLowerCase() !== 'backspace'){
        const keyButton = document.getElementById(`key-${key.toLowerCase()}`);
        if(keyButton){
            keyButton.classList.forEach((className) => {
                if (className.startsWith('bg-')) {
                    keyButton.classList.remove(className);
                }
            });

            keyButton.classList.add('disabled','bg-transparent');
        }
    }
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



