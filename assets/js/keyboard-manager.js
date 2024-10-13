const keyboard = (() => {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER','Z', 'X', 'C', 'V', 'B', 'N', 'M','DELETE'],
    ];
    const mainEl = document.querySelector('main');
    const keyboardContainer = document.createElement('div');
    keyboardContainer.id = 'keyboard-container';
    keyboardContainer.classList.add('container-fluid','text-center','p-3','position-fixed','bottom-0','w-100', 'bg-dark');
    keyboardContainer.style.zIndex = '1050';
    mainEl.appendChild(keyboardContainer);

    const setKeyColor = (key, color) => {
        const colorHelper = {
            green: 'success',
            yellow: 'warning',
            grey: 'secondary'
        };
        const bgColor = colorHelper[color] || color;
        if(key.toLowerCase() !== 'delete' && key.toLowerCase() !== 'enter' && key.toLowerCase() !== 'backspace'){
            const keyButton = document.getElementById(`key-${key.toLowerCase()}`);
            if(keyButton){
                //clear all bg- classes
                keyButton.classList.forEach((className) => {
                    if (className.startsWith('bg-')) {
                        keyButton.classList.remove(className);
                    }
                });
                keyButton.classList.add(`bg-${bgColor}`);
            }
        }
    }

    return {
        initialize: (displayEnterAndDeleteBool=true) => {
            keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
                keyboardRow.classList.add('d-flex','justify-content-center','flex-nowrap','mb-2');

                row.forEach(key => {
                    const keyButton = document.createElement('button');
                    keyButton.textContent = key;
                    keyButton.classList.add('key-btn','btn','btn-secondary','m-1','btn-sm','flex-grow-0'); //TODO: what btn-sm and flex-grow-0 doing?
                    keyButton.style.border = 0;
                    keyButton.id = `key-${key.toLowerCase()}`;

                    if (key === 'ENTER' || key === 'DELETE') {
                        if(displayEnterAndDeleteBool){
                            //TODO: change enter and delete keys to icons
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
        },

        disableKey: (key) => {
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
        },
        setKeyColorGreen: (key) => setKeyColor(key, 'success'),
        setKeyColorYellow: (key) => setKeyColor(key, 'warning'),
        setKeyColorGrey: (key) => setKeyColor(key, 'secondary'),
        setKeyColorRed: (key) => setKeyColor(key, 'danger'),
        setKeyColorTransparent: (key) => setKeyColor(key, 'transparent'),
        setKeyColorWhite: (key) => setKeyColor(key, 'light'),
        setKeyColorBlue: (key) => setKeyColor(key, 'primary'),
        setKeyColor
    }
})();



//TODO: DELETE THIS EVENTUALLY
/* IMPLEMENT THIS CODE TO USE THE KEYBOARD */
// const alphabet = 'abcdefghijklmnopqrstuvwxyz';
// const handleKeyPress = (key) => {
//     const k = key.toLowerCase();
//     if (key === 'delete' || key === 'backspace') {
//         console.log('Delete key pressed');
//     } else if (key === 'enter') {
//         console.log('Enter key pressed');
//     } else if (alphabet.includes(k)) {
//         console.log('Letter key pressed:', key);
//     }
// }