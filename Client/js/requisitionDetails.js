const divReqInfo = document.getElementById('requisition-info');
const reqProducts = document.getElementById('products');

function showRequisitionInfo(requisition) {
    const requisitionInfo = document.createElement('article');
    requisitionInfo.dataset.number = requisition.number;

    requisitionInfo.innerHTML = `
        <p>N&uacute;mero de requisici&oacute;n: ${requisition.number}</p>
        <p>Fecha de requisici&oacute;n: ${requisition.date}</p>`;

    divReqInfo.appendChild(requisitionInfo);
}

function showReqProducts(products) {
    const fragment = document.createDocumentFragment();

    products.forEach(p => {
        const product = document.createElement('article');
        product.dataset.id = p.id;

        product.innerHTML = `
            <p>C&oacute;digo del producto: ${p.id}</p>
            <p>Cantidad solicitada: ${p.units}</p>`;

        fragment.appendChild(product);
    });
    reqProducts.appendChild(fragment);
}

function showError(message) {
    reqProducts.innerHTML = message;
}

document.getElementById('back-button').addEventListener('click', e => {
    location.href = 'requisitions.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const number = urlParams.get('number');
    
    executeRequest( //GET
        'get',
        `http://localhost:3000/api/requisitions/${number}`,
        showRequisitionInfo,
        showError
    );
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const number = urlParams.get('number');

    executeRequest( //GET
        'get',
        `http://localhost:3000/api/requisitions/${number}/products`,
        showReqProducts,
        showError
    );
});