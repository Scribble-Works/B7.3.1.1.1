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
    if (enable) {
        answerPending = true;
    } else {
        answerPending = false;
    }
}

// --- GAME STATE FUNCTIONS ---

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    score = 0;
    questionCount = 0;
    document.getElementById('score').textContent = `Score: 0`;
    
    newAngle();
}

function endGame() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}

function newAngle() {
    if (questionCount >= MAX_QUESTIONS) {
        endGame();
        return;
    }

    questionCount++;
    document.getElementById('question-number').textContent = questionCount;
    
    const specialAngles = [90];
    let angle = Math.floor(Math.random() * 359) + 1;

    if (Math.random() < 0.2) {
        currentAngle = specialAngles[0];
    } else {
        if (angle === 180) angle = 179; 
        currentAngle = angle;
    }

    document.getElementById('angle-display').textContent = currentAngle + '°';
    document.getElementById('feedback').textContent = "Choose a classification!";
    document.getElementById('feedback').style.color = '#333';
    
    toggleButtons(true);
    document.getElementById('next-button').disabled = true;
}

function checkAnswer(userChoice) {
    if (!answerPending) return;

    const correctAnswer = getClassification(currentAngle);
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');

    toggleButtons(false);

    // Play sound based on correctness
    const correctSound = document.getElementById('correctSound');
    const incorrectSound = document.getElementById('incorrectSound');

    if (userChoice === correctAnswer) {
        score++;
        feedbackElement.textContent = `✅ Correct! ${currentAngle}° is an ${correctAnswer} angle.`;
        feedbackElement.style.color = '#28a745';
        correctSound.currentTime = 0;
        correctSound.play().catch(() => {});
    } else {
        feedbackElement.textContent = `❌ Incorrect. The correct answer is ${correctAnswer}.`;
        feedbackElement.style.color = '#dc3545';
        incorrectSound.currentTime = 0;
        incorrectSound.play().catch(() => {});
    }

    scoreElement.textContent = `Score: ${score}`;

    if (questionCount === MAX_QUESTIONS) {
        document.getElementById('next-button').disabled = true;
        setTimeout(endGame, 2000);
    } else {
        document.getElementById('next-button').disabled = false;
    }
}