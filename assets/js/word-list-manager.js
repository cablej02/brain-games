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