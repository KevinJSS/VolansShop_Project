const { Router } = require('express');
const router = Router();

module.exports = router;

const Joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

const filePath = 'data/inventory.json';
const purchaseType = 1;
const requisitionType = 2;
let productList;

function productListReader(res) {
    let fileData;
    try {
        fileData = fs.readFileSync(filePath);
    } catch (error) {
        return res.status(404).send({ "error": "Datos del archivo no encontrados." });
    }

    try {
        productList = JSON.parse(fileData).products;
    } catch (error) {
        return res.status(404).send({ "error": "El archivo JSON contiene errores" });
    }
}

function productListWriter(res) {
    try {
        fs.writeFileSync(filePath, JSON.stringify({ "products": productList }, null, 2));
    } catch (error) {
        return res.status(404).send({ "error": "Error de escritura en archivo JSON" });
    }
}

function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Allow-Methods, Access-Control-Request-Headers, Access-Control-Allow-Origin");
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
}

router.options('/', (req, res) => {
    setHeaders(res);
    res.statusCode = 200; //OK
    res.end();
});

router.options('/:id', (req, res) => {
    setHeaders(res);
    res.statusCode = 200; //OK
    res.end();
});

router.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    productListReader(res);
    if (req.query.sortBy) {
        sortAscendingly(productList, req.query.sortBy);
    } else {
        sortAscendingly(productList, 'id');
    }
    res.send(productList);
});

function sortAscendingly(products, sortKey) {
    if (products !== undefined) {
        products.sort(function (p1, p2) {
            return p1[sortKey] > p2[sortKey] ? 1 : -1;
        });
    }
}

router.get('/:id', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    productListReader(res);
    const product = productList.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ "error": "Código del producto ingresado no encontrado." });
    res.send(product);
});

router.get('/:id/movements', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    productListReader(res);
    const product = productList.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ "error": "Código del producto ingresado no encontrado." });
    res.send(product.movements);
});

router.post('/', (req, res) => {
    setHeaders(res);
    productListReader(res);

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send({ "error": error.details[0].message }); //Bad request

    const product = {
        id: productList.length + 1,
        name: req.body.name,
        units: 0,
        movements: []
    }

    productList[productList.length] = product;
    productListWriter(res);
    res.send(product);
});

router.put('/:id', (req, res) => {
    setHeaders(res);
    productListReader(res);

    const product = productList.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ "error": "Código del producto ingresado no encontrado." });

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ "error": error.details[0].message }); //Bad request

    product.name = req.body.name;
    productListWriter(res);
    res.send(product);
});

router.delete('/:id', (req, res) => {
    setHeaders(res);
    productListReader(res);

    const product = productList.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send({ "error": "Código del producto ingresado no encontrado." });

    product.movements = [];
    productListWriter(res);
    res.send(product);
});

function addProducts(res, orderNumber, purchasedProducts) {
    let movement, product;
    let added = false;
    productListReader(res);
    
    purchasedProducts.forEach(r => {
        product = productList.find(p => p.id === parseInt(r.id));

        if (!product) {
            added = false;
            res.status(404).send({ "error": "Código del producto ingresado no encontrado." });
        }else if (r.units < 1) {
            added = false;
            res.status(400).send({ "error": "Las unidades de los productos no pueden ser menores a 1" });
        } else {

            movement = {
                type: purchaseType,
                movementCode: orderNumber,
                movementUnits: r.units
            }
    
            product.movements[product.movements.length] = movement;
            product.units += r.units;
            productListWriter(res);

            added = true;
        }

    });
    return added;
}

module.exports.addProducts = addProducts;

function removeProducts(res, requisitionNumber, requestedProducts) {
    let movement, product;
    let added = false;
    productListReader(res);

    requestedProducts.forEach(r => {
        product = productList.find(p => p.id === parseInt(r.id));
        if (!product) {
            added = false;
            res.status(404).send({ "error": "Código del producto ingresado no encontrado." });
        } else if (r.units < 1) {
            added = false;
            res.status(400).send({ "error": "Las unidades de los productos no pueden ser menores a 1" });
        } else if (r.units > product.units) {
            added = false;
            res.status(400).send({ "error": "Las unidades de los productos solicitados exceden las unidades disponibles en inventario" });
        } else {
            movement = {
                type: requisitionType,
                movementCode: requisitionNumber,
                movementUnits: r.units
            }
    
            product.movements[product.movements.length] = movement;
            product.units -= r.units;
            productListWriter(res);
    
            added = true;
        }
    });
    return added;
}

module.exports.removeProducts = removeProducts;
