let score = 0;
let draftScore = 0;
let questions = [];
let draftQuestions = [];
let timer = 60;
let timerInterval;

// Start the quiz
function startQuiz() {
    const topic = localStorage.getItem('selectedTopic');
    const level = localStorage.getItem('selectedLevel');

    const categoryMap = {
        'Science': 17,
        'General Knowledge': 19
    };
    const category = categoryMap[topic];

    if (!category || !level) {
        alert('Invalid topic or level!');
        return;
    }

    // Fetch questions from API
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${level}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            if (questions.length === 0) {
                alert('No questions available.');
                return;
            }
            startTimer();
            displayQuestions();
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Start the timer
function startTimer() {
    document.getElementById('timerSection').innerHTML = `Time Remaining: ${timer}s`;
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timerSection').innerHTML = `Time Remaining: ${timer}s`;
        if (timer <= 0) {
            clearInterval(timerInterval);
            submitQuiz(true); 
        }
    }, 1000);
}

// Display all questions
function displayQuestions() {
    const questionSection = document.getElementById('questionSection');
    questionSection.innerHTML = ''; 

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('mb-4');
        questionElement.innerHTML = `<h5>${index + 1}. ${question.question}</h5>`;
        questionElement.style.color = "#0e2e52";

        const allOptions = [...question.incorrect_answers, question.correct_answer];
        allOptions.sort(() => Math.random() - 0.5); 

        allOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('form-check');
            optionElement.innerHTML = `
                <input class="form-check-input" type="radio" name="question${index}" value="${option}">
                <label class="form-check-label">${option}</label>
            `;
            optionElement.style.color = "#295F98";
            questionElement.appendChild(optionElement);
        });

        const draftButton = document.createElement('button');
        draftButton.classList.add('btn', 'btn-outline-warning', 'mt-2');
        draftButton.textContent = 'Save to Draft';
        draftButton.onclick = (event) => addToDraft(event, index);
        questionElement.appendChild(draftButton);

        questionSection.appendChild(questionElement);
    });
}

// Add question to draft
function addToDraft(event, index) {
    event.preventDefault(); 
    if (!draftQuestions.includes(index)) {
        draftQuestions.push(index); 
        event.target.style.display = 'none'; 
    }
}

// Handle form submission for regular questions
document.getElementById('questionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitRegularQuestions();
});

// Submit regular questions
function submitRegularQuestions() {
    score = 0; 

    // Count answers from regular questions
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && selectedOption.value === question.correct_answer) {
            score += 1; 
        }
    });

    // Ask if the user wants to solve draft questions
    if (draftQuestions.length > 0) {
        const solveDrafts = confirm("Do you want to solve the drafted questions?");
        if (solveDrafts) {
            displayDraftQuestions();
        } else {
            hideAllAndShowScore(); 
        }
    } else {
        displayFinalScore();
    }
}

// Display draft questions
function displayDraftQuestions() {
    const questionSection = document.getElementById('questionSection');
    questionSection.innerHTML = ''; 

    draftQuestions.forEach(index => {
        const question = questions[index];
        const questionElement = document.createElement('div');
        questionElement.classList.add('mb-4');
        questionElement.innerHTML = `<h5>${index + 1}. ${question.question}</h5>`;
        questionElement.style.color = "#0e2e52";

        const allOptions = [...question.incorrect_answers, question.correct_answer];
        allOptions.sort(() => Math.random() - 0.5); 

        allOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('form-check');
            optionElement.innerHTML = `
                <input class="form-check-input" type="radio" name="draftQuestion${index}" value="${option}">
                <label class="form-check-label">${option}</label>
            `;
            optionElement.style.color = "#295F98";
            questionElement.appendChild(optionElement);
        });

        questionSection.appendChild(questionElement);
    });

    // Hide the "Submit Answers" button and show the "Submit All" button
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('submit-all-btn').style.display = 'block';
}

// Hide all and show only the score and retry section
function hideAllAndShowScore() {
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('submit-all-btn').style.display = 'none';
    document.getElementById('timerSection').style.display = 'none';
    displayFinalScore();
}

// Handle submission of both regular and draft questions
document.getElementById('submit-all-btn').addEventListener('click', function() {
    submitDraftQuestions();
});

// Submit draft questions
function submitDraftQuestions() {
    draftScore = 0; 

    // Count answers from draft questions
    draftQuestions.forEach(index => {
        const selectedOption = document.querySelector(`input[name="draftQuestion${index}"]:checked`);
        if (selectedOption && selectedOption.value === questions[index].correct_answer) {
            draftScore += 1; 
        }
    });

    // Hide everything except resultSection and retrySection
    hideAllAndShowScore();
}

// Display the final score
function displayFinalScore() {
    let totalScore = score + draftScore;
    let resultText = '';

    if (totalScore <= 3) {
        resultText = 'Bad☹';
    } else if (totalScore <= 6) {
        resultText = 'Fair';
    } else {
        resultText = 'Good👏🏻';
    }
    document.getElementById('resultSection').innerHTML = `
        <h4>Your Score: ${totalScore}/${questions.length}  "${resultText}"</h4>
    `;
    document.getElementById('retrySection').innerHTML = `
        <button class="btn btn-primary" onclick="restartQuiz()">Try Again</button>
        <button class="btn btn-secondary" onclick="window.location.href='index.html'">End Quiz</button>
    `;
}

// Restart the quiz
function restartQuiz() {
    document.getElementById('questionSection').style.display = "block";
    document.getElementById('submit-btn').style.display = "block";

    score = 0;
    draftScore = 0;
    timer = 60;
    document.getElementById('resultSection').innerHTML = '';
    document.getElementById('retrySection').innerHTML = '';
    document.getElementById('questionSection').innerHTML = '';
    startQuiz();
}

// Start the quiz when the page loads
window.onload = startQuiz;