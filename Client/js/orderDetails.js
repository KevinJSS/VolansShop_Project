const divReqInfo = document.getElementById('order-info');
const reqProducts = document.getElementById('products');

function showOrderInfo(order) {
    const orderInfo = document.createElement('article');
    orderInfo.dataset.number = order.number;

    orderInfo.innerHTML = `
    <p>N&uacute;mero de la orden: ${order.number}</p>
    <p>Fecha de la orden: ${order.date}</p>`;

    divReqInfo.appendChild(orderInfo);
}

function showOrderProducts(products) {
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
    location.href = 'orders.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const number = urlParams.get('number');
    
    executeRequest( //GET
        'get',
        `http://localhost:3000/api/purchase-orders/${number}`,
        showOrderInfo,
        showError
    );
});

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const number = urlParams.get('number');

    executeRequest( //GET
        'get',
        `http://localhost:3000/api/purchase-orders/${number}/products`,
        showOrderProducts,
        showError
    );
});