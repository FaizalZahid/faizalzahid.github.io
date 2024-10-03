const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
let targetWord = '';
let currentGuess = [];
let guessCount = 0;
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const newGameBtn = document.getElementById('new-game-btn');
const overlay = document.getElementById('overlay');
const messageBox = document.getElementById('message-box');
const messageTitle = document.getElementById('message-title');
const messageContent = document.getElementById('message-content');
const closeMessageBtn = document.getElementById('close-message');

for (let i = 0; i < MAX_GUESSES; i++) {
    for (let j = 0; j < WORD_LENGTH; j++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoard.appendChild(tile);
    }
}

const qwertyKeys = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
];

qwertyKeys.forEach(row => {
    const rowDiv = document.createElement('div');
    row.split('').forEach(letter => {
        const key = document.createElement('button');
        key.textContent = letter;
        key.classList.add('key');
        key.addEventListener('click', () => handleInput(letter));
        rowDiv.appendChild(key);
    });
    keyboard.appendChild(rowDiv);
});

const eraseBtn = document.createElement('button');
eraseBtn.innerHTML = '<i class="fa fa-window-close" aria-hidden="true"></i>';
eraseBtn.classList.add('key');
eraseBtn.addEventListener('click', handleBackspace);

const submitBtn = document.createElement('button');
submitBtn.innerHTML = '<i class="fa fa-sign-in" aria-hidden="true"></i>';
submitBtn.classList.add('key');
submitBtn.addEventListener('click', handleEnter);

const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.justifyContent = 'center';

buttonContainer.appendChild(eraseBtn);
buttonContainer.appendChild(submitBtn);
keyboard.appendChild(buttonContainer);

async function fetchWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
        const data = await response.json();
        targetWord = data[0].toUpperCase();
    } catch (error) {
        targetWord = 'ERROR';
    }
}

function handleEnter() {
    if (!gameOver && currentGuess.length === WORD_LENGTH) {
        const guessResult = checkGuess();
        if (guessCount < MAX_GUESSES) {
            guessCount++;
        }
        currentGuess = [];

        if (!gameOver) {
            updateBoard();
        }

        if (guessResult) {
            endGame(true);
        } else if (guessCount === MAX_GUESSES) {
            endGame(false);
        }
    }
}

function handleInput(letter) {
    if (!gameOver && currentGuess.length < WORD_LENGTH) {
        currentGuess.push(letter);
        updateBoard();
    }
}

function handleBackspace() {
    if (!gameOver && currentGuess.length > 0) {
        currentGuess.pop();
        updateBoard();
    }
}

function updateBoard() {
    const tiles = gameBoard.getElementsByClassName('tile');
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileIndex = guessCount * WORD_LENGTH + i;
        if (tileIndex < tiles.length) { // Check if tile exists
            const tile = tiles[tileIndex];
            tile.textContent = currentGuess[i] || '';
        }
    }
}

function checkGuess() {
    const guess = currentGuess.join('');
    const tiles = gameBoard.getElementsByClassName('tile');
    const keyboardKeys = keyboard.getElementsByClassName('key');

    let correctCount = 0;
    const presentLetters = {};
    const correctLetters = {};

    // First pass: Check for correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = tiles[guessCount * WORD_LENGTH + i];
        const letter = guess[i];
        const keyboardKey = Array.from(keyboardKeys).find(key => key.textContent === letter);

        if (letter === targetWord[i]) {
            tile.classList.add('correct');
            keyboardKey.classList.add('correct');
            correctCount++;
            correctLetters[letter] = (correctLetters[letter] || 0) + 1;
        }
    }

    // Second pass: Check for present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = tiles[guessCount * WORD_LENGTH + i];
        const letter = guess[i];
        const keyboardKey = Array.from(keyboardKeys).find(key => key.textContent === letter);

        if (targetWord.includes(letter) && !correctLetters[letter]) {
            if (!presentLetters[letter]) {
                tile.classList.add('present');
                presentLetters[letter] = true; // Mark this letter as present
                if (!keyboardKey.classList.contains('correct')) {
                    keyboardKey.classList.add('present');
                }
            }
        } else if (!correctLetters[letter]) {
            tile.classList.add('absent');
            keyboardKey.classList.add('absent');
        }
    }

    return correctCount === WORD_LENGTH;
}

function endGame(won) {
    gameOver = true;
    newGameBtn.style.display = 'none';

    let customMessage;
    let customTitle;
    if (won) {
        if (guessCount === 1) {
            customTitle = 'Amazing!';
            customMessage = 'You got it in just 1 try!';
        } else if (guessCount <= 3) {
            customTitle = 'Great job!';
            customMessage = 'You guessed the word in ' + guessCount + ' tries!';
        } else if (guessCount <= 5) {
            customTitle = 'Good effort!';
            customMessage = 'You found the word in ' + guessCount + ' tries!';
        } else {
            customTitle = 'You did it!';
            customMessage = 'It took you ' + guessCount + ' tries!';
        }
        showMessage(customTitle, customMessage);
    } else {
        showMessage('Game Over', `You've used all ${MAX_GUESSES} guesses. The word was "${targetWord}".`);
    }

    const askButton = document.createElement('button');
    const existingAskButton = messageBox.querySelector('.ask-button');
    if (existingAskButton) {
        messageBox.removeChild(existingAskButton);
    }
    const existingResponseText = messageBox.querySelector('.response-text');
    if (existingResponseText) {
        messageBox.removeChild(existingResponseText);
    }
    askButton.classList.add('ask-button');
    askButton.style.fontSize = '25px';
    askButton.innerHTML = '<img src="../img/Sonia AI Loop 2.gif" alt="Icon" style="width: 30px; height: 30px; margin-right: 5px;"> Ask Sonia AI the meaning';
    const askQuery = 'What is the meaning of the word ' + targetWord;
    askButton.onclick = async () => {
        try {
            const response = await fetch('https://soniachat.vercel.app/api/soniachat.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: askQuery })
            });
            const data = await response.json();
            
            const responseText = document.createElement('p');
            responseText.classList.add('response-text');
            responseText.textContent = data.text || 'No response available.';
            messageBox.appendChild(responseText);
        } catch (error) {
            const responseText = document.createElement('p');
            responseText.classList.add('response-text');
            responseText.textContent = 'Error fetching meaning. Please try again.';
            messageBox.appendChild(responseText);
        }
    };
    messageBox.appendChild(askButton);
}

function showMessage(title, content) {
    messageTitle.textContent = title;
    messageContent.textContent = content;
    overlay.style.display = 'block';
    messageBox.style.display = 'block';

    const existingButton = messageBox.querySelector('.new-game-button');
    if (existingButton) {
        messageBox.removeChild(existingButton);
    }

    const newGameButton = document.createElement('button');
    newGameButton.classList.add('new-game-button');
    newGameButton.textContent = 'New Game';
    newGameButton.style.marginTop = '10px';
    newGameButton.style.padding = '10px 20px';
    newGameButton.style.fontSize = '1rem';
    newGameButton.style.cursor = 'pointer';
    newGameButton.style.backgroundColor = '#FCBF47';
    newGameButton.style.color = 'black';
    newGameButton.style.border = 'none';
    newGameButton.style.borderRadius = '5px';
    newGameButton.style.boxShadow = '0 0 10px #FFD700';
    newGameButton.addEventListener('click', startNewGame);

    messageBox.appendChild(newGameButton);
}

function hideMessage() {
    overlay.style.display = 'none';
    messageBox.style.display = 'none';
}

function startNewGame() {
    gameOver = false;
    currentGuess = [];
    guessCount = 0;
    newGameBtn.style.display = 'none';
    hideMessage();

    const tiles = gameBoard.getElementsByClassName('tile');
    Array.from(tiles).forEach(tile => {
        tile.textContent = '';
        tile.className = 'tile';
    });

    // Reset keyboard
    const keys = keyboard.getElementsByClassName('key');
    Array.from(keys).forEach(key => {
        key.className = 'key';
    });

    fetchWord();
}

document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        if (e.key === 'Backspace') {
            handleBackspace();
        } else if (e.key === 'Enter') {
            handleEnter();
        } else if (/^[A-Za-z]$/.test(e.key)) {
            handleInput(e.key.toUpperCase());
        }
    }
});

eraseBtn.addEventListener('click', handleBackspace);
submitBtn.addEventListener('click', handleEnter);
newGameBtn.addEventListener('click', startNewGame);
closeMessageBtn.addEventListener('click', hideMessage);

fetchWord();