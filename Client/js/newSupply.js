function newSupply(response) {
    window.alert(`${response.name} agregado correctamente.`);
}

function redirect() {
    window.location = '../web/inventory.html'
}

function showError(message) {
    document.getElementById('response-text').innerHTML = message;
}

document.getElementById('back-button').addEventListener('click', e => {
    location.href = '../web/inventory.html';
});

document.getElementById('add-button').addEventListener('click', e => {
    const name = document.getElementById('name').value;

    const data = `{"name":"${name}"}`;
    executeRequest(
        'post',
        'http://localhost:3000/api/inventory',
        newSupply,
        showError,
        data,
        null,
        redirect
    );
});