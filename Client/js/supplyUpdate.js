function updateSupply(response) {
    window.alert(`${response.name} modificado correctamente`);
}

function redirect() {
    window.location = '../web/inventory.html'
}

function showSupply(supply) {
    document.getElementById('supply-code').innerHTML = `C&oacute;digo del producto: ${supply.id}`;
    document.getElementById('supply-name').value = supply.name;
    document.getElementById('id').value = supply.id;
}

function showError(message) {
    document.getElementById('response-text').innerHTML = message;
}

document.getElementById('back-button').addEventListener('click', e => {
    location.href = '../web/inventory.html';
});

document.getElementById('update-button').addEventListener('click', e => {
    const id = document.getElementById('id').value;
    const name = document.getElementById('supply-name').value;
    const data = `{"name":"${name}"}`;
    executeRequest(
        'put',
        `http://localhost:3000/api/inventory/${id}`,
        updateSupply,
        showError,
        data,
        null,
        redirect
    )
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')

    executeRequest(
        'get',
        `http://localhost:3000/api/inventory/${id}`,
        showSupply,
        showError
    );
});