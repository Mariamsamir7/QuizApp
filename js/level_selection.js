document.getElementById('levelForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const topic = document.getElementById('topic').value;
    const level = document.getElementById('level').value;

    if (topic === "Topic" || level === "Level") {
        document.getElementById('errorMessage').textContent = "Please select both a topic and a level.";
        return;
    }

    localStorage.setItem('selectedTopic', topic);
    localStorage.setItem('selectedLevel', level);

    window.location.href = "quiz.html";});