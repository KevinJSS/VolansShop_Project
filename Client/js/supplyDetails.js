const divSupplyInfo = document.getElementById('supply-info');
const divSupplyMovements = document.getElementById('movements');

function showSupplyInfo(supply) {
    const supplyInfo = document.createElement('article');
    supplyInfo.dataset.id = supply.id;
    supplyInfo.innerHTML = `
        <p>C&oacute;digo del producto: ${supply.id}</p>
        <p>Nombre del producto: ${supply.name}</p>
        <p>Existencias: ${supply.units}</p>`;
    
    divSupplyInfo.appendChild(supplyInfo);
}

function showSupplyMovements(movements) {
    let temp = "";
    let hasMovements = false;
    const fragment = document.createDocumentFragment();

    if (movements.length !== 0) {
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
        divSupplyMovements.innerHTML = '<p style="color:#228ddb;">Este suministro no posee movimientos asociados</p><br><br><br><br>';
    }
}

function showError(message) {
    divSupplyMovements.innerHTML = message;
}

document.getElementById('back-button').addEventListener('click', e => {
    location.href = '../web/inventory.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    
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
    const id = urlParams.get('id')

    executeRequest( //GET
        'get',
        `http://localhost:3000/api/inventory/${id}/movements`,
        showSupplyMovements,
        showError
    );
});