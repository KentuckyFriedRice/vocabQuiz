// Load flashcards from a JSON file
let flashcards = [];
let currentCardIndex = 0;

fetch('decks/flashcards.json')
    .then(response => {
          console.log("Response status:", response.status);
          return response.json();          
})
    .then(data => {
        flashcards = data;
        displayFlashcard();
    })
    .catch(error => console.error('Error loading flashcards:', error));

function displayFlashcard() {
    if (currentCardIndex < flashcards.length) {
        document.getElementById('question').innerText = flashcards[currentCardIndex].question;
        document.getElementById('answer').value = '';
        document.getElementById('feedback').innerText = '';
    } else {
        document.getElementById('question').innerText = 'All done!';
        document.getElementById('answer').style.display = 'none';
        document.getElementById('submit-answer').style.display = 'none';
    }
}

document.getElementById('submit-answer').addEventListener('click', checkAnswer);

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const correctAnswer = flashcards[currentCardIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = 'Correct!';
        currentCardIndex++;
        setTimeout(displayFlashcard, 1000);
    } else {
        document.getElementById('feedback').innerText = 'Try again!';
    }
}
