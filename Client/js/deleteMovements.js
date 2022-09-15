const divSupplyName = document.getElementById('supply-name');
const divSupplyMovements = document.getElementById('movements');
let hasMovements = true;
let deleted = false;

function showSupplyInfo(supply) {
    document.getElementById('supply-name').innerHTML = `<p>SUMINISTRO:&nbsp;&nbsp;${supply.name}</p>`;
}

function showSupplyMovements(movements) {
    let temp = "";
    const fragment = document.createDocumentFragment();

    if (movements.length === undefined || movements.length === 0) {
        hasMovements = false;
    } else {
        hasMovements = true;
    }

    if (hasMovements) {
        hasMovements = true;

        movements.forEach(m => {
            const movement = document.createElement('article');
            if (m.type == 1) {
                temp = `<p>Tipo de movimiento: Orden</p>`;
            } else {
                temp = `<p>Tipo de movimiento: Requisici&oacute;n</p>`;
            }
            temp += `<p>C&oacute;digo del movimiento: ${m.movementCode}</p>
            <p>Unidades: ${m.movementUnits}</p>`;

            movement.innerHTML = temp;
            fragment.appendChild(movement);
        });
        divSupplyMovements.appendChild(fragment);
    } else {
        hasMovements = false;
        showError('<p style="color:#228ddb;">Este suministro no posee movimientos asociados</p><br><br><br><br><br><br>');
    }
}

function showError(message) {
    divSupplyMovements.innerHTML = message;
}

document.getElementById('back-button').addEventListener('click', e => {
    location.href = '../web/inventory.html';
});

document.getElementById('delete').addEventListener('click', e => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    
    if (hasMovements && !deleted) {
        hasMovements = false;

        executeRequest(
            'delete',
            `http://localhost:3000/api/inventory/${id}`,
            showSupplyMovements,
            showError
        );
    } else {
        window.alert('Este suministro no cuenta con movimientos a eliminar.');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    
    executeRequest( //GET
        'get',
        `http://localhost:3000/api/inventory/${id}`,
        showSupplyInfo,
        showError
    );
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    executeRequest( //GET
        'get',
        `http://localhost:3000/api/inventory/${id}/movements`,
        showSupplyMovements,
        showError
    );
});