document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = usersDB.find(user => user.username === username && user.password === password);

    if (user) {
        window.location.href = "level_selection.html"; 
    } else {
        document.getElementById('loginMessage').textContent = 'Invalid data';
    }
});