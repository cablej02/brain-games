const keyboard = (() => {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER','Z', 'X', 'C', 'V', 'B', 'N', 'M','DELETE'],
    ];
    const mainEl = document.querySelector('main');
    const keyboardContainer = document.createElement('div');
    keyboardContainer.id = 'keyboard-container';
    keyboardContainer.classList.add('container-fluid','text-center','position-fixed','bottom-0','w-100', 'bg-dark');
    keyboardContainer.style.zIndex = '1050';
    mainEl.appendChild(keyboardContainer);

    const setKeyColor = (key, color) => {
        const colorHelper = {
            green: 'success',
            yellow: 'warning',
            grey: 'secondary',
            transparent: 'transparent',
            red: 'danger',
            primary: 'primary',
            secondary: 'secondary',
            warnining: 'warning',
            danger: 'danger',
            success: 'success',
        };
        const bgColor = colorHelper[color] || color;
        if(key.toLowerCase() !== 'delete' && key.toLowerCase() !== 'enter' && key.toLowerCase() !== 'backspace'){
            const keyButton = document.getElementById(`key-${key.toLowerCase()}`);
            
            if(keyButton){
                const classesToRemove = [];
                keyButton.classList.forEach((className) => {
                    if (className.startsWith('bg-') || className.startsWith('border-')) {
                        classesToRemove.push(className);
                    }
                });
                classesToRemove.forEach((className) => keyButton.classList.remove(className));
                if(bgColor === 'transparent'){
                    keyButton.classList.add(`bg-${bgColor}`,'border-secondary');
                }else{
                    keyButton.classList.add(`bg-${bgColor}`,`border-${bgColor}`);
                }
            }
        }
    }

    const resetKeys = () => {
        keyboardLayout.forEach(row => {
            row.forEach(key => setKeyColor(key, 'grey'));
        });
    }

    return {
        initialize: (displayEnterAndDeleteBool=true) => {
            keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
                keyboardRow.classList.add('keyboard-row','d-flex','justify-content-center','flex-nowrap');

                row.forEach(key => {
                    const keyButton = document.createElement('button');
                    keyButton.textContent = key;
                    keyButton.classList.add('key-btn','btn','btn-secondary','flex-grow-0'); //TODO: what btn-sm and flex-grow-0 doing?
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
        setKeyColorGreen: (key) => setKeyColor(key, 'green'),
        setKeyColorYellow: (key) => setKeyColor(key, 'yellow'),
        setKeyColorGrey: (key) => setKeyColor(key, 'grey'),
        setKeyColorRed: (key) => setKeyColor(key, 'red'),
        setKeyColorTransparent: (key) => setKeyColor(key, 'transparent'),
        setKeyColorWhite: (key) => setKeyColor(key, 'light'),
        setKeyColorBlue: (key) => setKeyColor(key, 'primary'),
        setKeyColor,
        resetKeys
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