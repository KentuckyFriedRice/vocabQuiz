// Load flashcards from a JSON file
let flashcards = [];
let currentCardIndex = 0;
let score = 0;  // Initialize score
let hasTriedOnce = false;  // To track if the user has already tried once
let missedQuestions = []; // Array to store missed questions
let selectedDecks = []; // Array to store selected deck names

// Sample JSON files (you should replace these with your actual JSON files)
const availableDecks = [
    { name: 'Example', file: 'decks/flashcards.json' },
    { name: 'Deck 2', file: 'decks/deck2.json' },
    { name: 'Deck 3', file: 'decks/deck3.json' }
];

// Event listener for the start button
document.getElementById('start-button').addEventListener('click', startQuiz);

// Event listener for the decks button
document.getElementById('decks-button').addEventListener('click', showDecks);

// Function to display the decks for selection
function showDecks() {
    // Hide the start container and show the decks container
    document.getElementById('start-container').style.display = 'none';
    const checkboxList = document.getElementById('checkbox-list');
    checkboxList.innerHTML = ''; // Clear previous checkboxes

    // Create checkboxes for each available deck
    availableDecks.forEach(deck => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = deck.file; // Use file path as value
        checkbox.name = deck.name; // Use deck name for identification
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(deck.name));
        checkboxList.appendChild(label);
        checkboxList.appendChild(document.createElement('br'));
    });

    // Show the decks container
    document.getElementById('decks-container').style.display = 'block';
}

// Event listener for confirming deck selection
document.getElementById('confirm-decks-button').addEventListener('click', confirmDecks);

// Function to confirm selected decks and start the quiz
function confirmDecks() {
    const checkboxes = document.querySelectorAll('#checkbox-list input[type="checkbox"]');
    selectedDecks = []; // Reset selected decks

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedDecks.push(checkbox.value); // Store selected deck file paths
        }
    });

    // Hide decks container and show start button
    document.getElementById('decks-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';
}

// Function to start the quiz
function startQuiz() {
    // Check if any deck has been selected
    if (selectedDecks.length === 0) {
        alert("Please select at least one deck before starting the quiz!"); // Alert the user
        return; // Prevent further execution if no decks are selected
    }

    // Hide start button and show question container
    document.getElementById('start-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';

    // Reset the quiz variables
    currentCardIndex = 0;
    score = 0;
    hasTriedOnce = false;
    missedQuestions = [];

    // Load the selected decks
    loadDecks();
}

// Function to load flashcards from selected decks
function loadDecks() {
    if (selectedDecks.length === 0) {
        alert("Please select at least one deck!");
        return; // No decks selected
    }

    // Load flashcards from each selected deck
    let promises = selectedDecks.map(deck => fetch(deck).then(response => response.json()));
    
    Promise.all(promises).then(deckDataArray => {
        flashcards = [].concat(...deckDataArray); // Merge all flashcards into one array
        displayFlashcard(); // Display the first flashcard
    }).catch(error => console.error('Error loading flashcards:', error));
}

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
        showFinalResults();
    }
}

// Function to show the final results
function showFinalResults() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';

    document.getElementById('final-score').innerText = `Your final score is: ${score} out of ${flashcards.length}`;

    if (missedQuestions.length > 0) {
        const missedList = missedQuestions.map(q => `<li>${q.question} (Correct Answer: ${q.answer})</li>`).join('');
        document.getElementById('missed-questions').innerHTML = `Missed Questions:<ul>${missedList}</ul>`;
    } else {
        document.getElementById('missed-questions').innerText = "Great job! You got everything correct!";
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
        } else {
            document.getElementById('feedback').innerText = 'Incorrect! Try again.';
            hasTriedOnce = true;  // Set the flag that the user has tried once
            return;  // Stop the function to give the user a chance to retry
        }
        // Move to the next question
        currentCardIndex++; 
        setTimeout(() => {
            displayFlashcard();  // Show the next flashcard
        }, 1000);  // Short delay before showing next card
    }
}

// Function to reset variables and show the start screen again.
function restartQuiz() {
    // Reset all variables to their initial states
    flashcards = [];
    currentCardIndex = 0;
    score = 0;
    hasTriedOnce = false;
    missedQuestions = [];

    // Clear any results content
    document.getElementById('final-score').innerText = '';
    document.getElementById('missed-questions').innerHTML = '';

    // Hide the results container and show the start container
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';
    document.getElementById('decks-container').style.display = 'none';
}


