const divSupplies = document.getElementById('supplies');

function showSupplies(supplies) {
    const fragment = document.createDocumentFragment();

    if (supplies.length !== 0) {
        supplies.forEach(s => {
            const suplyElement = document.createElement('article');
            suplyElement.dataset.id = s.id;
    
            suplyElement.innerHTML = `
                <section id="product-image">
                    <img src="../images/sueta.png" alt="">
                </section>
    
                <section id="supply-elements">
                    <div id="supply-info">
                        <h3>Producto: ${s.name}</h3>
                        <p>Existencias: ${s.units}</p>
                    </div>
    
                    <div id="supply-buttons">
                        <button id="update">Actualizar</button>
                        <button id="delete-movements">Eliminar movimientos</button>
                        <button id="see-details">Ver detalles</button>
                    </div>
                </section>`;
            fragment.appendChild(suplyElement);
        });
        divSupplies.appendChild(fragment);
    } else {
        document.getElementById('empty-list').innerHTML = `<p">La lista de suministros est&aacute; vac&iacute;a</p>
        <br><br><br><br><br><br><br><br><br><br><br><br><br>`;
    }
}

function showError(message) {
    document.getElementById('supplies').innerHTML = message;
}

divSupplies.addEventListener('click', e => {
    if (e.target.nodeName === 'BUTTON') {
        const id = e.target.parentNode.parentNode.parentNode.dataset.id;

        if (e.target.id === 'see-details') {
            location.href = `supply-details.html?id=${id}`;

        } else if (e.target.id === 'delete-movements') {
            location.href = `delete-movements.html?id=${id}`;

        } else if (e.target.id === 'update') {
            location.href = `supply-update.html?id=${id}`;
        }
    }
});

document.getElementById('add-supply').addEventListener('click', e => {
    location.href = 'new-supply.html';
});

document.addEventListener("DOMContentLoaded", function () {
    executeRequest( //GET
        'get',
        'http://localhost:3000/api/inventory',
        showSupplies,
        showError
    );
});