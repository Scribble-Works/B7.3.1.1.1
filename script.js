let currentAngle = 0;
let score = 0;
let questionCount = 0;
const MAX_QUESTIONS = 20;
let answerPending = false; // TRUE when waiting for classification input

// --- UTILITY FUNCTIONS ---

function getClassification(angle) {
    if (angle < 90) {
        return 'Acute';
    } else if (angle === 90) {
        return 'Right';
    } else if (angle > 90 && angle < 180) {
        return 'Obtuse';
    } else if (angle >= 180 && angle < 360) {
        return 'Reflex';
    } else {
        return 'Invalid';
    }
}

/**
 * Enables or disables the classification buttons.
 */
function toggleButtons(enable) {
    const buttons = document.querySelectorAll('.button-group button');
    buttons.forEach(button => {
        button.disabled = !enable;
    });
    // Update answerPending flag only when enabling buttons for a new question
    if (enable) {
        answerPending = true;
    } else {
        answerPending = false;
    }
}


// --- GAME STATE FUNCTIONS ---

/**
 * Starts the game, hides the start screen, and shows the game container.
 */
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    score = 0;
    questionCount = 0;
    document.getElementById('score').textContent = `Score: 0`;
    
    newAngle();
}

/**
 * Ends the game and displays the game over screen.
 */
function endGame() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    // 
}

/**
 * Generates a random angle and updates the display.
 */
function newAngle() {
    if (questionCount >= MAX_QUESTIONS) {
        endGame();
        return;
    }

    // Question count and display update
    questionCount++;
    document.getElementById('question-number').textContent = questionCount;
    
    // Generate a random angle between 1 and 359 degrees.
    const specialAngles = [90];
    let angle = Math.floor(Math.random() * 359) + 1;

    // 1 in 5 chance of generating a Right angle (90)
    if (Math.random() < 0.2) {
        currentAngle = specialAngles[0];
    } else {
        // Exclude 180 (Straight Angle) and 360 (Full Rotation)
        if (angle === 180) angle = 179; 
        currentAngle = angle;
    }

    document.getElementById('angle-display').textContent = currentAngle + '°';
    document.getElementById('feedback').textContent = "Choose a classification!";
    document.getElementById('feedback').style.color = '#333';
    
    // Enable classification buttons, disable 'Next Angle' button
    toggleButtons(true);
    document.getElementById('next-button').disabled = true;
}

/**
 * Checks the user's selected answer against the correct classification.
 */
function checkAnswer(userChoice) {
    // Crucial check: only proceed if an answer is pending (buttons are enabled)
    if (!answerPending) return; 

    const correctAnswer = getClassification(currentAngle);
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');

    // Disable buttons immediately after a choice is made
    toggleButtons(false);
    
    if (userChoice === correctAnswer) {
        score++;
        feedbackElement.textContent = `✅ Correct! ${currentAngle}° is an ${correctAnswer} angle.`;
        feedbackElement.style.color = '#28a745'; // Green
    } else {
        feedbackElement.textContent = `❌ Incorrect. The correct answer is ${correctAnswer}.`;
        feedbackElement.style.color = '#dc3545'; // Red
    }

    scoreElement.textContent = `Score: ${score}`;

    // If this was the last question, automatically move to end game after feedback delay
    if (questionCount === MAX_QUESTIONS) {
        document.getElementById('next-button').disabled = true; // Disable "Next" on the last question
        setTimeout(endGame, 2000);
    } else {
        // Otherwise, enable the "Next Angle" button
        document.getElementById('next-button').disabled = false;
    }
}