// Load flashcards from a JSON file
let flashcards = [];
let currentCardIndex = 0;
let score = 0;  // Initialize score
let hasTriedOnce = false;  // To track if the user has already tried once
let missedQuestions = []; // Array to store missed questions
let selectedDecks = []; // Array to store selected deck names

// Sample JSON files (you should replace these with your actual JSON files)
const availableDecks = [
    {
        grade: '1年',
        decks: [
            /*{ name: '1年 Winter ALL', file: 'decks/1_winter2024/1_winter2024_ALL.json' },
            { name: '1年 Winter 1-10', file: 'decks/1_winter2024/1_winter2024_1.json' },
            { name: '1年 Winter 11-20', file: 'decks/1_winter2024/1_winter2024_2.json' },
            { name: '1年 Winter 21-30', file: 'decks/1_winter2024/1_winter2024_3.json' },
            { name: '1年 Winter 31-40', file: 'decks/1_winter2024/1_winter2024_4.json' },
            { name: '1年 Winter 41-50', file: 'decks/1_winter2024/1_winter2024_5.json' },
            { name: '1年 Winter 51-60', file: 'decks/1_winter2024/1_winter2024_6.json' },
            { name: '1年 Winter 61-70', file: 'decks/1_winter2024/1_winter2024_7.json' },
            { name: '1年 Winter 71-80', file: 'decks/1_winter2024/1_winter2024_8.json' },
            { name: '1年 Winter 81-90', file: 'decks/1_winter2024/1_winter2024_9.json' },
            { name: '1年 Winter 91-100', file: 'decks/1_winter2024/1_winter2024_10.json' }*/
            { name: 'Here We Go 1 Unit 1', file: 'decks/1_tak/HereWeGo1Unit1.json' }
        ]
    },
    {
        grade: '2年',
        decks: [
            { name: '2年 Winter ALL', file: 'decks/2_winter2024/2_winter2024_ALL.json' },
            { name: '2年 Winter 1-10', file: 'decks/2_winter2024/winter2024_1-10.json' },
            { name: '2年 Winter 11-20', file: 'decks/2_winter2024/winter2024_11-20.json' },
            { name: '2年 Winter 21-30', file: 'decks/2_winter2024/winter2024_21-30.json' },
            { name: '2年 Winter 31-40', file: 'decks/2_winter2024/winter2024_31-40.json' },
            { name: '2年 Winter 41-50', file: 'decks/2_winter2024/winter2024_41-50.json' },
            { name: '2年 Winter 51-60', file: 'decks/2_winter2024/winter2024_51-60.json' },
            { name: '2年 Winter 61-70', file: 'decks/2_winter2024/winter2024_61-70.json' },
            { name: '2年 Winter 71-80', file: 'decks/2_winter2024/winter2024_71-80.json' },
            { name: '2年 Winter 81-90', file: 'decks/2_winter2024/winter2024_81-90.json' },
            { name: '2年 Winter 91-100', file: 'decks/2_winter2024/winter2024_91-100.json' }
        ]
    },
    {
        grade: '3年',
        decks: [
            { name: '3年 Winter ALL', file: 'decks/3_winter2024/3_winter2024_ALL.json' },
            { name: '3年 Winter 1-10', file: 'decks/3_winter2024/3_winter2024_1-10.json' },
            { name: '3年 Winter 11-20', file: 'decks/3_winter2024/3_winter2024_11-20.json' },
            { name: '3年 Winter 21-30', file: 'decks/3_winter2024/3_winter2024_21-30.json' },
            { name: '3年 Winter 31-40', file: 'decks/3_winter2024/3_winter2024_31-40.json' },
            { name: '3年 Winter 41-50', file: 'decks/3_winter2024/3_winter2024_41-50.json' },
            { name: '3年 Winter 51-60', file: 'decks/3_winter2024/3_winter2024_51-60.json' },
            { name: '3年 Winter 61-70', file: 'decks/3_winter2024/3_winter2024_61-70.json' },
            { name: '3年 Winter 71-80', file: 'decks/3_winter2024/3_winter2024_71-80.json' },
            { name: '3年 Winter 81-90', file: 'decks/3_winter2024/3_winter2024_81-90.json' },
            { name: '3年 Winter 91-100', file: 'decks/3_winter2024/3_winter2024_91-100.json' }
        ]
    }
];

// Event listener for the start button
document.getElementById('start-button').addEventListener('click', startQuiz);

// Event listener for the decks button
document.getElementById('decks-button').addEventListener('click', showDecks);

// Function to display the decks for selection
function showDecks() {
    document.getElementById('start-container').style.display = 'none';
    const checkboxList = document.getElementById('checkbox-list');
    checkboxList.innerHTML = ''; // Clear previous checkboxes

    availableDecks.forEach(group => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = group.grade;
        details.appendChild(summary);

        group.decks.forEach((deck, index) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = deck.file;
            checkbox.name = deck.name;

            if (selectedDecks.includes(checkbox.value)) {
                checkbox.checked = true;
            }

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(deck.name));
            details.appendChild(label);
            details.appendChild(document.createElement('br'));
        });

        checkboxList.appendChild(details);
    });

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

    // Save the selected decks to Local Storage
    localStorage.setItem('selectedDecks', JSON.stringify(selectedDecks));

    // Hide decks container and show start button
    document.getElementById('decks-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';

    loadDecks();
    console.log("loaded decks");
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
    //loadDecks();
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
        //check for shuffle checkbox and shuffle deck
        if (document.getElementById("shuffle").checked == true){
            shuffle(flashcards);
            console.log(flashcards);
        }
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
    document.getElementById('question').innerText = 'All done!';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('restart').style.display = 'inline';

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
    userAnswer = document.getElementById('answer').value.trim();
    correctAnswer = flashcards[currentCardIndex].answer;
    if (document.getElementById("shuffle").checked == true){
        userAnswer = userAnswer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
        correctAnswer = correctAnswer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
    }
    if (document.getElementById("caps").checked == true){
        userAnswer = userAnswer.toLowerCase();
        correctAnswer = correctAnswer.toLowerCase();
    }
    // Clear the answer box after submission
    document.getElementById('answer').value = '';  // Clear the input box after checking the answer

    if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = 'Correct!';
        
        score++;  // Increment score 

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
        } else {
            document.getElementById('feedback').innerText = 'Incorrect! Try again.';
            hasTriedOnce = true;  // Set the flag that the user has tried once
            missedQuestions.push({
                question: flashcards[currentCardIndex].question,
                answer: flashcards[currentCardIndex].answer
            });
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
    location.reload();
}

window.onload = function() {
    // Load saved selected decks from Local Storage
    const savedDecks = JSON.parse(localStorage.getItem('selectedDecks'));
    
    if (savedDecks && savedDecks.length > 0) {
        selectedDecks = savedDecks;
        console.log('Loaded saved decks:', selectedDecks);
        loadDecks();
        console.log("loaded decks");
    }
    
    // If you want to pre-check the checkboxes based on saved decks:
    //const checkboxes = document.querySelectorAll('#checkbox-list input[type="checkbox"]');
    //checkboxes.forEach(checkbox => {
     //   if (selectedDecks.includes(checkbox.value)) {
    //        checkbox.checked = true;
    //    }
   // });
};

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
