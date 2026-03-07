const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const wpmElement = document.getElementById('wpm');

let words = [];
let currentWordCount = 25;
let startTime;

// 1. LOAD WORDS FROM JSON
async function loadWords() {
    try {
        const response = await fetch('words.json');
        const data = await response.json();
        // Filters out very short words if desired
        words = data.commonWords;
        renderNewQuote();
    } catch (error) {
        console.error("Failed to load words:", error);
    }
}

// 2. RENDER THE WORDS (With Word Containers)
function renderNewQuote() {
    quoteDisplayElement.innerHTML = '';
    quoteInputElement.value = '';
    wpmElement.innerText = 0;
    startTime = null;

    // Get random selection
    const randomWords = [...words].sort(() => 0.5 - Math.random()).slice(0, currentWordCount);

    randomWords.forEach((word, index) => {
        const wordEl = document.createElement('div');
        wordEl.classList.add('word');

        // Letters
        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            wordEl.appendChild(charSpan);
        });

        // Space (Only if it's not the very last word of the test)
        if (index < randomWords.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerText = ' ';
            wordEl.appendChild(spaceSpan);
        }

        quoteDisplayElement.appendChild(wordEl);
    });

    // Mark the first character as active (caret position)
    const firstChar = quoteDisplayElement.querySelector('span');
    if (firstChar) firstChar.classList.add('active');
}

// 3. INPUT HANDLING & LOGIC
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    // Start timer on first keystroke
    if (!startTime) startTime = new Date();

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        characterSpan.classList.remove('active');

        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }
    });

    // Update Caret (Active Class)
    const nextChar = arrayQuote[arrayValue.length];
    if (nextChar) {
        nextChar.classList.add('active');
    }

    // WPM Calculation
    const timeInSeconds = (new Date() - startTime) / 1000;
    const wordCount = arrayValue.length / 5; // Standard WPM calculation (5 chars = 1 word)
    if (timeInSeconds > 0) {
        wpmElement.innerText = Math.round(wordCount / (timeInSeconds / 60));
    }

    // Check for Finish
    if (arrayValue.length >= arrayQuote.length) {
        showResults();
    }
});

// 4. RESULTS & THEMING FUNCTIONS
function showResults() {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const correctChars = quoteDisplayElement.querySelectorAll('span.correct').length;
    const accuracy = Math.round((correctChars / arrayQuote.length) * 100);

    document.getElementById('final-wpm').innerText = wpmElement.innerText;
    document.getElementById('final-accuracy').innerText = accuracy + "%";
    document.getElementById('results-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('results-modal').style.display = 'none';
    renderNewQuote();
    quoteInputElement.focus();
}

function changeWordCount(count) {
    currentWordCount = count;
    renderNewQuote();
    quoteInputElement.focus();
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

// 5. INITIALIZATION
loadWords();

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Keep focus on input even if user clicks away
document.addEventListener('click', () => quoteInputElement.focus());

// Export functions to window scope for HTML onclicks
window.changeWordCount = changeWordCount;
window.setTheme = setTheme;
window.closeModal = closeModal;