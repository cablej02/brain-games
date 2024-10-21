//Statics
const GAME_TYPE = {
    WORD_MASTERS: 'WORD_MASTERS',
    HANGMAN: 'HANGMAN',
    SCRAMBLE: 'SCRAMBLE'
}

const wordList = (() => {
    let validWords = {};
    let solutionWords = {};
    const getRandomWord = (length = 5) => {
        const solWordsByLength = solutionWords[length] || [];
        if(solWordsByLength.length > 0){
            return solWordsByLength[Math.floor(Math.random() * solWordsByLength.length)];
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

    const generateLoadWordsConfig = (gameType) => {
        if(gameType === GAME_TYPE.WORD_MASTERS){
            return {
                loadValidWords: true,
                load5LetterSolutionWords: true,
                loadOtherSolutionWords: false,
                wordLengthMin: 5,
                wordLengthMax: 5
            }
        }else if(gameType === GAME_TYPE.HANGMAN){
            return {
                loadValidWords: false,
                load5LetterSolutionWords: true,
                loadOtherSolutionWords: true,
                wordLengthMin: 5,
                wordLengthMax: 10
            }
        }else if(gameType === GAME_TYPE.SCRAMBLE){
            return {
                loadValidWords: false,
                load5LetterSolutionWords: true,
                loadOtherSolutionWords: false,
                wordLengthMin: 5,
                wordLengthMax: 5
            }
        }else{
            console.warning(`Invalid game name: ${gameType}.  Loading all words.`);
            return {
                loadValidWords: true,
                load5LetterSolutionWords: true,
                loadOtherSolutionWords: true,
                wordLengthMin: 5,
                wordLengthMax: 10
            }
        }
    }

    const loadWords = async (GAME_TYPE) => {
        const config = generateLoadWordsConfig(GAME_TYPE);

        const processWords = (text,targetObj, filter = () => true) => {
            const words = text.split(',');
            let count = 0;
            words.forEach(word => {
                if(filter(word)){
                    if(!targetObj[word.length]){
                        targetObj[word.length] = [];
                    }
                    targetObj[word.length].push(word);
                    count++;
                }
            });
            return (count);
        };
        
        validWords = {};
        solutionWords = {};
        
        try {
            if(config.loadValidWords){
                const validWordsResponse = await fetch('assets/word-list/scrabble_words.csv');
                const validWordsText = await validWordsResponse.text();
                const validWordsCount = processWords(validWordsText,validWords, word => word.length >= config.wordLengthMin && word.length <= config.wordLengthMax);
                console.log(`Loaded ${validWordsCount} valid words from file`);
            }

            let solWordsCount = 0;
            if(config.load5LetterSolutionWords){
                const sol5Response = await fetch('assets/word-list/sol_words_5_letters.csv');
                const sol5Text = await sol5Response.text();
                solWordsCount += processWords(sol5Text,solutionWords);
            }
            if(config.loadOtherSolutionWords){
                const solOthersResponse = await fetch('assets/word-list/words.csv');
                const solOthersText = await solOthersResponse.text();
                solWordsCount += processWords(solOthersText,solutionWords, word => word.length !== 5 && word.length >= config.wordLengthMin && word.length <= config.wordLengthMax);
            }
            console.log(`Loaded ${solWordsCount} solution words from file`);

            //OLD WAY OF LOADING WORDS.  ALWAYS LOADED ALL
            // const [validWordsResponse,sol5Response,solOthersResponse] = await Promise.all([
            //     fetch('assets/word-list/scrabble_words.csv'),
            //     fetch('assets/word-list/sol_words_5_letters.csv'),
            //     fetch('assets/word-list/words.csv')
            // ]);

            // const [validWordsText,sol5Text,solOthersText] = await Promise.all([
            //     validWordsResponse.text(),
            //     sol5Response.text(),
            //     solOthersResponse.text()
            // ]);

            // const [validWordsCount,sol5Count,solOthersCount] = await Promise.all([
            //     processWords(validWordsText,validWords, word => word.length <= 10),
            //     processWords(sol5Text,solutionWords),
            //     processWords(solOthersText,solutionWords, word => word.length !== 5)
            // ]);
        } catch (error) {
            console.error('Error loading word list',error);
        }
    }
    return {
        loadWords,
        getRandomWord,
        isValidWord
    }
})();