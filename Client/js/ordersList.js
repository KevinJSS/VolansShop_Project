const divRequisitions = document.getElementById('orders');

function showOrders(orders) {
    const fragment = document.createDocumentFragment();

    if (orders.length !== 0) {
        orders.forEach(o => {
            const orderElement = document.createElement('article');
            orderElement.dataset.number = o.number;
    
            orderElement.innerHTML = `
                <div id="order-info">
                    <p>N&uacute;mero de la orden: ${o.number}</p>
                    <p>Fecha de la orden: ${o.date}</p>
                </div>
                
                <div id="order-button">
                    <button id="see-details">Ver detalles</button>
                </div>`;
            
            fragment.appendChild(orderElement);
        });
        divRequisitions.appendChild(fragment);
    } else {
        document.getElementById('empty-list').innerHTML = `<p">La lista de &oacute;rdenes de compra est&aacute; vac&iacute;a</p>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;
    }
}

function showError(message) {
    document.getElementById('orders').innerHTML = message;
}

divRequisitions.addEventListener('click', e => {
    if (e.target.nodeName === 'BUTTON') {
        const number = e.target.parentNode.parentNode.dataset.number;
        location.href = `order-details.html?number=${number}`;
    }
});

document.getElementById('add-order').addEventListener('click', e => {
    location.href = 'new-order.html';
});

document.addEventListener("DOMContentLoaded", function () {
    executeRequest( //GET
        'get',
        'http://localhost:3000/api/purchase-orders',
        showOrders,
        showError
    );
});