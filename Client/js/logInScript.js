function verifiedUser(response) {
    location.href = '../web/inventory.html'
}

function showError(message) {
    document.getElementById('response-text').innerHTML = message;
}

document.getElementById('log-in').addEventListener('click', e => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    executeRequest(
        'get',
        `http://localhost:3000/api/log-in?username=${username}&password=${password}`,
        verifiedUser,
        showError
    );
});

document.getElementById('forgot-password').addEventListener('click', e => {
    window.alert("Relájate, respira... Ya la recordar\u00E1s!");
});