const divRequisitons = document.getElementById('requisitions');

function showRequisitions(requisitions) {
    const fragment = document.createDocumentFragment();

    if (requisitions.length !== 0) {
        requisitions.forEach(r => {
            const requisitionElement = document.createElement('article');
            requisitionElement.dataset.number = r.number;
    
            requisitionElement.innerHTML = `
                <div id="requisition-info">
                    <p>N&uacute;mero de requisici&oacute;n: ${r.number}</p>
                    <p>Fecha de requisici&oacute;n: ${r.date}</p>
                </div>
                
                <div id="requisition-button">
                    <button id="see-details">Ver detalles</button>
                </div>`;
            
            fragment.appendChild(requisitionElement);
        });
        divRequisitons.appendChild(fragment);
    } else {
        document.getElementById('empty-list').innerHTML = `<p">La lista de requisiciones est&aacute; vac&iacute;a</p>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;
    }
}

function showError(message) {
    document.getElementById('requisitions').innerHTML = message;
}

divRequisitons.addEventListener('click', e => {
    if (e.target.nodeName === 'BUTTON') {
        const number = e.target.parentNode.parentNode.dataset.number;
        location.href = `requisition-details.html?number=${number}`;
    }
});

document.getElementById('add-requisition').addEventListener('click', e => {
    location.href = 'new-requisition.html';
});

document.addEventListener("DOMContentLoaded", function () {
    executeRequest( //GET
        'get',
        'http://localhost:3000/api/requisitions',
        showRequisitions,
        showError
    );
});