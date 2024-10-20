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

    const loadWords = async () => {
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
            const [validWordsResponse,sol5Response,solOthersResponse] = await Promise.all([
                fetch('assets/word-list/scrabble_words.csv'),
                fetch('assets/word-list/sol_words_5_letters.csv'),
                fetch('assets/word-list/words.csv')
            ]);

            const [validWordsText,sol5Text,solOthersText] = await Promise.all([
                validWordsResponse.text(),
                sol5Response.text(),
                solOthersResponse.text()
            ]);

            const [validWordsCount,sol5Count,solOthersCount] = await Promise.all([
                processWords(validWordsText,validWords, word => word.length <= 10),
                processWords(sol5Text,solutionWords),
                processWords(solOthersText,solutionWords, word => word.length !== 5)
            ]);

            console.log(`Loaded ${validWordsCount} valid words from file`);
            console.log(`Loaded ${sol5Count + solOthersCount} solution words from file`);
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