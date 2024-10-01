// Load flashcards from a JSON file
let flashcards = [];
let currentCardIndex = 0;
let score = 0;  // Initialize score

fetch('decks/flashcards.json')
    .then(response => response.json())
    .then(data => {
        flashcards = data;
        displayFlashcard();
    })
    .catch(error => console.error('Error loading flashcards:', error));

// Function to display the current flashcard
function displayFlashcard() {
    if (currentCardIndex < flashcards.length) {
        document.getElementById('question').innerText = flashcards[currentCardIndex].question;
        document.getElementById('answer').value = '';
        document.getElementById('feedback').innerText = '';
        document.getElementById('score').innerText = `Score: ${score}`; // Update score display
    } else {
        document.getElementById('question').innerText = 'All done!';
        document.getElementById('answer').style.display = 'none';
        document.getElementById('submit-answer').style.display = 'none';
        document.getElementById('feedback').innerText = `Your final score is: ${score} out of ${flashcards.length}`;
    }
}

// Event listener for the submit button
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Event listener to allow "Enter" key to submit the answer
document.getElementById('answer').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();  // Trigger the same checkAnswer function
    }
});

// Function to check the answer
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const correctAnswer = flashcards[currentCardIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = 'Correct!';
        score++;  // Increment the score for a correct answer
        currentCardIndex++;
        setTimeout(displayFlashcard, 1000);  // Move to next card after a short delay
    } else {
        document.getElementById('feedback').innerText = 'Try again!';
    }
}
