// Load flashcards from a JSON file
let flashcards = [];
let currentCardIndex = 0;
let score = 0;  // Initialize score
let hasTriedOnce = false;  // To track if the user has already tried once
let missedQuestions = []; // Array to store missed questions

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
        // Display the final results if no more flashcards
        showFinalResults();
    }
}

// Function to show the final results
function showFinalResults() {
    document.getElementById('question').innerText = 'All done!';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('submit-answer').style.display = 'none';

    // Prepare missed questions for display
    if (missedQuestions.length > 0) {
        const missedList = missedQuestions.map(q => `<li>${q.question} (Correct Answer: ${q.answer})</li>`).join('');
        document.getElementById('feedback').innerHTML = `
            Your final score is: ${score} out of ${flashcards.length}<br><br>
            Missed Questions:<ul>${missedList}</ul>`;
    } else {
        document.getElementById('feedback').innerText = `Your final score is: ${score} out of ${flashcards.length}. Great job!`;
    }
    document.getElementById('score').innerText = `Final Score: ${score}`; // Display final score at the end
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

        // Move to the next question or display results if it's the final flashcard
        currentCardIndex++;
        setTimeout(() => {
            // Check if we have more flashcards
            if (currentCardIndex < flashcards.length) {
                displayFlashcard();  // Call to show the next flashcard
            } else {
                showFinalResults();  // Call to show final results
            }
        }, 1000);  // Short delay before showing next card
    } else {
        if (hasTriedOnce) {
            document.getElementById('feedback').innerText = 'Wrong again! Moving to the next question.';
            // Add missed question to the array
            missedQuestions.push({
                question: flashcards[currentCardIndex].question,
                answer: flashcards[currentCardIndex].answer
            });
            // Move to the next question
            currentCardIndex++; 
            setTimeout(() => {
                // Check if we have more flashcards after the second attempt
                if (currentCardIndex < flashcards.length) {
                    displayFlashcard();  // Call to show the next flashcard
                } else {
                    showFinalResults();  // Call to show final results
                }
            }, 1000);  // Short delay before showing next card
        } else {
            document.getElementById('feedback').innerText = 'Wrong! You have one more try.';
            hasTriedOnce = true;  // Mark that the user has tried once
        }
    }
}
