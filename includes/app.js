// Load flashcards from a JSON file
let flashcards = [];
let currentCardIndex = 0;
let score = 0;  // Initialize score
let hasTriedOnce = false;  // To track if the user has already tried once

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
        document.getElementById('answer').value = '';  // Clear the answer box when displaying a new card
        document.getElementById('feedback').innerText = '';
        document.getElementById('score').innerText = `Score: ${score}`; // Update score display
        hasTriedOnce = false;  // Reset retry flag for each new flashcard
    } else {
        // Display the final results
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

    // Clear the answer box after submission
    document.getElementById('answer').value = '';  // Clear the input box after checking the answer

    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = 'Correct!';
        
        // Increment the score for the first attempt or the second attempt if it's correct
        if (!hasTriedOnce) {
            score++;  // Increment score only if the user hasn't already retried
        } else {
            // If it's correct on the retry, increment the score
            score++;
        }

        // If it's the final flashcard, update score and move to final results
        if (currentCardIndex === flashcards.length - 1) {
            document.getElementById('score').innerText = `Score: ${score}`;  // Display updated score before showing final message
            setTimeout(() => {
                document.getElementById('feedback').innerText = `Your final score is: ${score} out of ${flashcards.length}`;
                document.getElementById('answer').style.display = 'none';
                document.getElementById('submit-answer').style.display = 'none';
            }, 1000);  // Short delay before showing final result
        } else {
            currentCardIndex++;
            setTimeout(displayFlashcard, 1000);  // Move to the next card after a short delay
        }
    } else {
        if (hasTriedOnce) {
            document.getElementById('feedback').innerText = 'Wrong again! Moving to the next question.';
            
            // If it's the last question, display the final result
            if (currentCardIndex === flashcards.length - 1) {
                setTimeout(() => {
                    document.getElementById('feedback').innerText = `Your final score is: ${score} out of ${flashcards.length}`;
                    document.getElementById('answer').style.display = 'none';
                    document.getElementById('submit-answer').style.display = 'none';
                }, 1000);  // Display final result if it's the last question
            } else {
                currentCardIndex++;  // Move to the next question after second attempt
                setTimeout(displayFlashcard, 1000);  // Move to next card after a short delay
            }
        } else {
            document.getElementById('feedback').innerText = 'Wrong! You have one more try.';
            hasTriedOnce = true;  // Mark that the user has tried once
        }
    }
}
