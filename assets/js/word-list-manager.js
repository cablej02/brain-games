const wordList = (() => {
    const validWords = {};
    const solutionWords = {};
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

    const loadWords = async () => {
        //clear validWords array
        for (let i in validWords) {
            validWords[i] = [];
        }

        try{
            const response = await fetch('assets/word-list/scrabble_words.csv');
            const text = await response.text();
            let i = 0;
            text.split(',').map(word => {
                    if(word.length <= 10){
                    if (!validWords[word.length]) {
                        validWords[word.length] = [];
                    }
                    validWords[word.length].push(word);
                    i++;
                }
            });
            console.log('Loaded valid words from file:', i);
        } catch (error){
            console.error('Error valids loading words:', error);
        }

        for(let i in solutionWords){
            solutionWords[i] = [];
        }

        try{
            const response_5_letters = await fetch('assets/word-list/sol_words_5_letters.csv');
            const response_others = await fetch('assets/word-list/words.csv');
            const text_5_letters = await response_5_letters.text();
            const text_others = await response_others.text();
            let i = 0;
            text_5_letters.split(',').map(word => {
                if (!solutionWords[word.length]) {
                    solutionWords[word.length] = [];
                }
                solutionWords[word.length].push(word);
                i++;
            });
            text_others.split(',').map(word => {
                if(word.length !== 5){
                    if (!solutionWords[word.length]) {
                        solutionWords[word.length] = [];
                    }
                    solutionWords[word.length].push(word);
                    i++;
                }
            });
            console.log('Loaded solution words from file:', i);
        } catch (error){
            console.error('Error loading solution words:', error);
        }
    }
    return {
        loadWords,
        getRandomWord,
        isValidWord,
        validWords
    }
})();