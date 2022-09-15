const divSupplies = document.getElementById('supply-list');
const divCurrentSupplies = document.getElementById('current-supplies');
let supplyCounter = 0;
let units;

function newRequisition() {
    window.alert('Requisici\u00F3n agregada correctamente.');
}

function redirect() {
    location.href = 'requisitions.html';
}

function showSupplies(supplies) {
    const fragment = document.createDocumentFragment();

    supplies.forEach(s => {
        const suplyElement = document.createElement('article');
        suplyElement.dataset.id = s.id;

        suplyElement.innerHTML = `
            <div>
                <h3>Producto: ${s.name}</h3>
                <p>Existencias: ${s.units}</p>
                <span>Cantidad a solicitar:</span>
                <input type="number" id="units${s.id}" value="0">
            </div>

            <div id="supply-buttons">
                <button id="add-button">Agregar suministro</button>
            </div>`;

        fragment.appendChild(suplyElement);
    });
    divSupplies.appendChild(fragment);
}

function addSupply(supply) {
    const supplyElement = document.createElement('article');
    supplyElement.dataset.id = supply.id;

    supplyElement.innerHTML = `
        <div id="supply-info">
            <p>Producto: ${supply.name}</p>
            <p>Unidades solicitadas: ${units}</p>
            <input type="hidden" id="units_${supply.id}" value="${units}"> 
        </div>
        
        <div id="req-button">
            <button id="remove-button">Remover suministro</button>
        </div>`;

    supplyCounter++;

    if (supplyCounter === 1) {
        divCurrentSupplies.innerHTML = '';
    }

    divCurrentSupplies.appendChild(supplyElement);
    window.alert('Suministro agregado');
}

function showError(message) {
    window.alert(message);
}

divSupplies.addEventListener('click', e => {
    if (e.target.nodeName === 'BUTTON') {
        const id = e.target.parentNode.parentNode.dataset.id;
        units = document.getElementById(`units${id}`).value;

        if (!units || units === '0') {
            window.alert('Es necesario indicar la cantidad de unidades a solicitar.');
        } else {
            executeRequest( //GET
                'get',
                `http://localhost:3000/api/inventory/${id}`,
                addSupply,
                showError
            );
            document.getElementById(`units${id}`).value = '0';
        }
    }
});

divCurrentSupplies.addEventListener('click', e => {
    if (e.target.nodeName === 'BUTTON') {
        const id = e.target.parentNode.parentNode.dataset.id;
        divCurrentSupplies.removeChild(e.target.parentNode.parentNode);
        supplyCounter--;
        ifCurrentSuppliesEmpty();
    }
});

document.getElementById('back-button').addEventListener('click', e => {
    location.href = 'requisitions.html';
});

function ifCurrentSuppliesEmpty() {
    if (supplyCounter === 0) {
        divCurrentSupplies.innerHTML = "<p style='color: #228ddb;'>A&uacute;n no hay suministros agregados a la requisici&oacute;n</p>";
    }
}
ifCurrentSuppliesEmpty();

document.getElementById('add-requisition').addEventListener('click', e => {
    if (supplyCounter !== 0) {
        let data = '{"products" : [';
        divCurrentSupplies.childNodes.forEach(e => {
            data += `{"id": ${e.dataset.id}, "units": ${document.getElementById(`units_${e.dataset.id}`).value}}`;
            supplyCounter--;
            if (supplyCounter !== 0) {
                data += ",";
            } else {
                data += "]}";
            }
        });

        executeRequest(
            'post',
            'http://localhost:3000/api/requisitions',
            newRequisition,
            showError,
            data,
            null,
            redirect
        );
        ifCurrentSuppliesEmpty();

    } else {
        window.alert('No se han agregado suministros a la requisici\u00F3n');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    executeRequest( //GET
        'get',
        'http://localhost:3000/api/inventory',
        showSupplies,
        showError
    );
});