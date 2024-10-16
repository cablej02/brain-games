const UI = (() => {
    const guessContainerEl = document.getElementById('guess-container');
    const bodyEl = document.querySelector('body');

    //modal elements
    const showModalBtnEl = document.getElementById('modal-button');

    const cancelGameModal = new bootstrap.Modal(document.getElementById('cancel-game-modal'));
    const cancelGameModalEl = document.getElementById('cancel-game-modal');
    const cancelGameModalTextEl = document.getElementById('cancel-game-txt');
    const cancelGameModalBtnEl = document.getElementById('cancel-game-btn');

    const newGameModal = new bootstrap.Modal(document.getElementById('new-game-modal'));
    const newGameModalEl = document.getElementById('new-game-modal');
    const newGameModalTextEl = document.getElementById('game-over-txt');
    const newGameModalBtnEl = document.getElementById('new-game-btn');

    // Bootstrap colors
    const rootStyles = getComputedStyle(document.documentElement);
    const successColor = rootStyles.getPropertyValue('--bs-success').trim();
    const warningColor = rootStyles.getPropertyValue('--bs-warning').trim();
    const secondaryColor = rootStyles.getPropertyValue('--bs-secondary').trim();

    let currentGuessRowEl = null;
    const displayNewEmptyRow = (solLength) => {
        const existingRows = guessContainerEl.querySelectorAll('.guess-row');

        currentGuessRowEl = document.createElement('div');
        currentGuessRowEl.className = 'guess-row d-flex justify-content-center flex-nowrap';

        for(let i = 0; i < solLength; i++) {
            const letterBoxEl = document.createElement('div');
            letterBoxEl.setAttribute('id',`r${guessContainerEl.children.length}l${i}`);
            letterBoxEl.className = 'border border-3 fw-bold no-select text-center m-md-1 m-sm-0 flex-shrink-0 square';
            
            currentGuessRowEl.appendChild(letterBoxEl);
        };

        const numCorrectEl = document.createElement('div');
        numCorrectEl.className = 'border border-3 m-md-1 m-sm-0 fw-bold no-select text-center rounded-circle flex-shrink-0 circle invisible';
        currentGuessRowEl.insertBefore(numCorrectEl, currentGuessRowEl.firstChild);

        const numMisplacedEl = document.createElement('div');
        numMisplacedEl.className = 'border border-3 m-md-1 m-sm-0 fw-bold no-select text-center rounded-circle flex-shrink-0 circle invisible';
        currentGuessRowEl.appendChild(numMisplacedEl);

        guessContainerEl.insertBefore(currentGuessRowEl, guessContainerEl.firstChild);

        // Animate existing rows down
        anime({
            targets: existingRows[0],
            translateY: [-50,0],
            translateX: 0,
            duration: 500,
            easing: 'easeOutCubic',
        });

        // Animate the new row sliding in from the top
        anime({
            targets: currentGuessRowEl,
            translateX: [-1000, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutCubic',
        });
    }

    const displayLetter = (id,letter) => {
        const letterBoxEl = document.getElementById(id);
        if(letterBoxEl){
            letterBoxEl.textContent = letter.toUpperCase();
            letterBoxEl.setAttribute('data-letter', letter.toLowerCase());
            setLetterElementBgColor(letterBoxEl,CurrentGame.getLetterColor(letter.toLowerCase()));
        }
    }

    const setCurrentGuessRowStateGuessed = () => {
        if(currentGuessRowEl){
            [...currentGuessRowEl.children].forEach(child => {
                if(child.dataset.letter){
                    if(CurrentGame.getDisabledLetters().includes(child.dataset.letter)){
                        child.classList.remove('pointer');
                        child.setAttribute('data-btn-state','disabled');
                    }else{
                        child.classList.add('pointer');
                        child.setAttribute('data-btn-state','active')
                    }
                }
            });
        }else{
            console.error('Cannot add letters to a null row element');
        }
    }

    const disableLetterClick = (letter) => {
        console.log(`disabling letter: ${letter}`);
        const letterEls = guessContainerEl.querySelectorAll(`[data-letter="${letter}"]`);
        letterEls.forEach(el => {
            el.setAttribute('data-btn-state','disabled');
            el.classList.remove('pointer');
        });
    }

    const setLetterBgColor = (letter,color,greenIndex) => {
        let letterEls = guessContainerEl.querySelectorAll(`[data-letter="${letter}"]`);
    
        letterEls.forEach(el => {
            // Check if color is green and the last character of the id matches greenIndex
            const columnIndex = parseInt(el.id.slice(-1));
            
            if (color === 'green' && columnIndex === greenIndex) {
                setLetterElementBgColor(el, color, true);
            } else if (color === 'green' && columnIndex !== greenIndex) {
                setLetterElementBgColor(el, 'yellow', true);
            }else{
                setLetterElementBgColor(el, color, true);
            }
        });
    }

    const setLetterElementBgColor = (letterEl,color,animate) => {
        const colorHelper = {
            green: successColor,
            yellow: warningColor,
            grey: secondaryColor,
            transparent: 'rgba(0, 0, 0, 0)'
        };
        const bsColor = colorHelper[color] || secondaryColor;

        // If animate is not provided, default to true. Currently only preventing animation for curguessrow entry
        const dur = animate ? 400 : 0;

        const animationProps = {
            targets: letterEl,
            duration: dur,
            easing: 'easeInOutQuad'
        };

        if (color === 'transparent') {
            animationProps.backgroundColor = [letterEl.style.backgroundColor, colorHelper.transparent];
        } else {
            animationProps.backgroundColor = [letterEl.style.backgroundColor, bsColor];
        }

        anime(animationProps);
    }

    const displayNumCnMLetters = (numCorrect,numMisplaced) => {
        const numCorrectEl = currentGuessRowEl.children[0];
        numCorrectEl.classList.remove('invisible');
        numCorrectEl.textContent = numCorrect;
        numCorrectEl.classList.add('bg-success');

        const numMisplacedEl = currentGuessRowEl.children[currentGuessRowEl.children.length - 1];
        numMisplacedEl.classList.remove('invisible');
        numMisplacedEl.textContent = numMisplaced;
        numMisplacedEl.classList.add('bg-warning');

        anime({
            targets: [numCorrectEl, numMisplacedEl],
            scale: [0, 1],
            duration: 700,
            easing: 'easeOutCubic',
        });
    }

    const setGuessTextRed = () => {
        if(currentGuessRowEl){
            for(let i = 0; i < currentGuessRowEl.children.length; i++) {
                const letterBoxEl = currentGuessRowEl.children[i];
                letterBoxEl.classList.remove('custom-body-color');
                letterBoxEl.classList.add('text-danger');
            }
        }else{
            console.error('Cannot add letters to a null row element');
        }
    }

    const setCurGuessTextWhite = () => {
        if(currentGuessRowEl){
            for(let i = 0; i < currentGuessRowEl.children.length; i++) {
                const letterBoxEl = currentGuessRowEl.children[i];
                letterBoxEl.classList.remove('text-danger');
                letterBoxEl.classList.add('custom-body-color');
            }
        }else{
            console.error('Cannot add letters to a null row element');
        }
    }

    const shakeCurrentGuessRow = () => {
        if(currentGuessRowEl){
            anime({
                targets: currentGuessRowEl,
                translateX: [-10,10,-10,8,-6,4,-3,2,0],
                duration: 700,
                easing: 'easeInOutQuad'
            });
        }
    }

    const setGuessContainerHeight = () => {
        const headerHeight = document.querySelector('header').offsetHeight;
        const keyboardHeight = document.getElementById('keyboard-container').offsetHeight;
    
        const availHeight = window.innerHeight - headerHeight - keyboardHeight - 10;
        guessContainerEl.style.maxHeight = `${availHeight}px`;
    }

    const setUI = () => {
        guessContainerEl.innerHTML = '';
        keyboard.resetKeys();

        const guesses = CurrentGame.getGuesses();
        const solLength = CurrentGame.getSolution().length;
        for(let i = 0; i < guesses.length; i++){
            displayNewEmptyRow(solLength);
            for(let j = 0; j < guesses[i].length; j++){
                displayLetter(`r${i}l${j}`, guesses[i][j]);
            }
            const [numCorrect,numMisplaced] = GameManager.calcNumCnMLetters(guesses[i]);
            displayNumCnMLetters(numCorrect,numMisplaced);
            setCurrentGuessRowStateGuessed();
        }

        const {greenLetters,yellowLetters,greyLetters,transparentLetters} = CurrentGame.getAllLetterColors();
        yellowLetters.forEach(letter => {
            setLetterBgColor(letter,'yellow');
            keyboard.setKeyColorYellow(letter)});
        greyLetters.forEach(letter => {
            setLetterBgColor(letter,'grey');
            keyboard.setKeyColorGrey(letter)
        });
        transparentLetters.forEach(letter => {
            setLetterBgColor(letter,'transparent');
            keyboard.setKeyColorTransparent(letter)
        });
        for(let i = 0; i < greenLetters.length; i++){
            if(greenLetters[i] !== null && greenLetters[i] !== undefined && greenLetters[i] !== ''){
                setLetterBgColor(greenLetters[i],'green',i);
                keyboard.setKeyColorGreen(greenLetters[i]);
            }
        }
        
        displayNewEmptyRow(solLength);
    }

    /* Event Listeners */
    bodyEl.addEventListener('keydown', (event) => GameManager.handleKeyPress(event.key));
    guessContainerEl.addEventListener('click', (event) => {
        if(event.target.dataset.btnState === 'active') GameManager.handleLetterColorChange(event.target);
    });
    guessContainerEl.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if(event.target.dataset.btnState === 'active') GameManager.handleLetterColorChangeTransparent(event.target);
    });

    showModalBtnEl.addEventListener('click', () => GameManager.handleModalBtnClick());
    cancelGameModalBtnEl.addEventListener('click', () => {cancelGameModal.hide(),GameManager.handleGameOver(false)});
    cancelGameModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => cancelGameModalBtnEl.focus(),300));
    newGameModalBtnEl.addEventListener('click', () => {GameManager.startNewGame(SOLUTION_LENGTH),newGameModal.hide()}); //TODO: add slider to select word length
    newGameModalEl.addEventListener('shown.bs.modal', () => setTimeout(() => newGameModalBtnEl.focus(),300));

    return{
        displayNewEmptyRow,
        displayLetter,
        setCurrentGuessRowStateGuessed,
        disableLetterClick,
        setLetterBgColor,
        setLetterElementBgColor,
        displayNumCnMLetters,
        setGuessTextRed,
        setCurGuessTextWhite,
        shakeCurrentGuessRow,
        setGuessContainerHeight,
        setUI,
        guessContainerEl,
        cancelGameModal,
        cancelGameModalTextEl,
        newGameModal,
        newGameModalTextEl,
        getCurrentGuessRowEl: () => currentGuessRowEl,
    }
})();