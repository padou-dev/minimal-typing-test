const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const wpmElement = document.getElementById('wpm');

let words = [];             // Stores the 10,000 words from JSON
let currentWordCount = 25;  // Default test length
let startTime;              // Tracks when the user starts typing

async function loadWords() {
    try {
        const response = await fetch('words.json');
        const data = await response.json();
        words = data.commonWords.filter(word => word.length > 2);
        
        // Initial start
        renderNewQuote(); 
    } catch (error) {
        console.error("Dictionary failed to load:", error);
    }
}

/**
 * RENDER FUNCTION: Drawing the test on screen
 */
function renderNewQuote() {
    let randomWords = [];
    for (let i = 0; i < currentWordCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex]);
    }

    quoteDisplayElement.innerHTML = '';

    randomWords.forEach(word => {
        const wordEl = document.createElement('div');
        wordEl.classList.add('word');

        // Add letters
        word.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            wordEl.appendChild(characterSpan);
        });

        // Add THE SPACE at the end of the word
        const spaceSpan = document.createElement('span');
        spaceSpan.innerText = ' '; // Explicit space character
        wordEl.appendChild(spaceSpan);

        quoteDisplayElement.appendChild(wordEl);
    });

    quoteInputElement.value = null;
    startTime = null;
    wpmElement.innerText = 0;

    // Set caret on the first letter of the first word
    const firstSpan = quoteDisplayElement.querySelector('span');
    if (firstSpan) firstSpan.classList.add('active');

    quoteInputElement.focus();
}

/**
 * Updates the test length and restarts the game
 */
function changeWordCount(count) {
    currentWordCount = count; // Update the global variable
    renderNewQuote();         // Call our updated render function
    
    // Crucial: Put the cursor back in the hidden input
    quoteInputElement.focus(); 
}
function showResults() {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const correctChars = quoteDisplayElement.querySelectorAll('span.correct').length;
    const totalChars = arrayQuote.length;
    
    // Calculate Accuracy
    const accuracy = Math.round((correctChars / totalChars) * 100);
    
    // Get WPM from the existing display
    const finalWpm = wpmElement.innerText;

    // Update Modal Text
    document.getElementById('final-wpm').innerText = finalWpm;
    document.getElementById('final-accuracy').innerText = accuracy + "%";
    
    // Show Modal
    document.getElementById('results-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('results-modal').style.display = 'none';
    renderNewQuote();
}

// UPDATE your Input Event Listener to trigger this:
quoteInputElement.addEventListener('input', () => {
    // ... your existing code ...

    // At the very bottom of the listener:
    if (quoteInputElement.value.length === quoteDisplayElement.querySelectorAll('span').length) {
        showResults();
    }
});

/**
 * CORE LOGIC: The Input Listener
 */
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    const currentInputLength = arrayValue.length;

    // Start timer on first keypress
    if (!startTime && currentInputLength > 0) {
        startTime = new Date();
    }

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];

        // --- Logic Part A: Correct/Incorrect Colors ---
        if (character == null) {
            // Not typed yet
            characterSpan.classList.remove('correct', 'incorrect');
        } else if (character === characterSpan.innerText) {
            // Correct
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            // Typo
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }

        // --- Logic Part B: The Caret Movement ---
        // We add 'active' to the span at the CURRENT index (where the next char goes)
        if (index === currentInputLength) {
            characterSpan.classList.add('active');
        } else {
            characterSpan.classList.remove('active');
        }
    });

    // --- Logic Part C: WPM Calculation ---
    if (startTime) {
        const timeInMinutes = (new Date() - startTime) / 60000;
        if (timeInMinutes > 0) {
            const charactersTyped = quoteInputElement.value.length;
            const wpm = Math.round((charactersTyped / 5) / timeInMinutes);
            wpmElement.innerText = wpm;
        }
    }

    // Check if finished
    if (currentInputLength === arrayQuote.length) {
        // You can add a 'Finished' popup here later!
        console.log("Test Complete!");
    }
});

/**
 * START APPLICATION
 */
loadWords();