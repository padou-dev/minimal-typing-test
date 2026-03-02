const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const wpmElement = document.getElementById('wpm');

const textToType = "The quick brown fox jumps over the lazy dog.";
let startTime;

// 1. Prepare the text: Split it into individual <span> letters
function renderNewQuote() {
    quoteDisplayElement.innerHTML = '';
    textToType.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
}

// 2. The Logic: Runs every time you press a key
quoteInputElement.addEventListener('input', () => {
    // Start the timer on the very first character typed
    if (!startTime) startTime = new Date();

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        if (character == null) {
            // User hasn't typed this character yet
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            // Correct match
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            // Typo!
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    // 3. WPM Calculation
    const timeInMinutes = (new Date() - startTime) / 60000;
    const charactersTyped = quoteInputElement.value.length;
    
    if (timeInMinutes > 0 && charactersTyped > 0) {
        const wpm = Math.round((charactersTyped / 5) / timeInMinutes);
        wpmElement.innerText = wpm;
    }

    // Optional: Reset or finish if the whole quote is correct
    if (correct) {
        alert("Finished! Great job.");
        startTime = null; // Reset for next time
    }
});

renderNewQuote();