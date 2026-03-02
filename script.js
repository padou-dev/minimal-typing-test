// 1. SELECTING HTML ELEMENTS
const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const wpmElement = document.getElementById('wpm');

// 2. GLOBAL VARIABLES (State of the app)
let words = [];             // Will hold our 10,000 words
let currentWordCount = 25;  // Default setting
let startTime;              // Used for WPM calculation

/**
 * 3. LOADING THE DICTIONARY
 * We use 'async' because fetching a file takes time.
 */
async function loadWords() {
    try {
        // Fetch the file you created
        const response = await fetch('words.json');
        const data = await response.json();
        
        // Filter out tiny 1-2 letter words for a better experience
        words = data.commonWords.filter(word => word.length > 2);
        
        // Now that words are ready, show the first test
        renderNewQuote();
    } catch (error) {
        console.error("Failed to load word list:", error);
        quoteDisplayElement.innerText = "Error loading dictionary.";
    }
}

/**
 * 4. GENERATING THE TEXT
 */
function renderNewQuote() {
    // Pick random words from our massive list
    let randomWords = [];
    for (let i = 0; i < currentWordCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex]);
    }
    const textToType = randomWords.join(' ');

    // Clear the screen
    quoteDisplayElement.innerHTML = '';
    
    // Wrap every single character in a <span> for color-coding
    textToType.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });

    // Reset everything for the new test
    quoteInputElement.value = null;
    startTime = null;
    wpmElement.innerText = 0;
}

/**
 * 5. WORD COUNT SELECTOR
 * This is called by the buttons in your HTML
 */
function changeWordCount(count) {
    currentWordCount = count;
    renderNewQuote();
    quoteInputElement.focus(); // Keep the cursor in the input
}

/**
 * 6. TYPING LOGIC (The Event Listener)
 */
quoteInputElement.addEventListener('input', () => {
    // Start the timer on the very first character
    if (!startTime) startTime = new Date();

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];

        if (character == null) {
            // User hasn't typed this yet
            characterSpan.classList.remove('correct', 'incorrect');
        } else if (character === characterSpan.innerText) {
            // Correct key
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            // Typo
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }
    });

    // WPM Calculation
    // (Total characters / 5) / (Time in milliseconds / 60,000)
    const timeElapsedInMinutes = (new Date() - startTime) / 60000;
    const charactersTyped = quoteInputElement.value.length;
    
    if (timeElapsedInMinutes > 0) {
        const wpm = Math.round((charactersTyped / 5) / timeElapsedInMinutes);
        wpmElement.innerText = wpm;
    }
});

// START THE APP
loadWords();