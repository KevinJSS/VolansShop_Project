const { Router } = require('express');
const router = Router();

module.exports = router;

const inventory = require('./inventory.js');
const Joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());

const filePath = 'data/purchase-orders.json';
let purchaseOrders;

function purchaseOrdersReader(res) {
    let fileData;
    try {
        fileData = fs.readFileSync(filePath);
    } catch (error) {
        return res.status(404).send({ "error": "Datos del archivo no encontrados." });
    }

    try {
        purchaseOrders = JSON.parse(fileData).orders;
    } catch (error) {
        return res.status(404).send({ "error": "El archivo JSON contiene errores" });
    }
}

function purchaseOrdersWriter(res) {
    try {
        fs.writeFileSync(filePath, JSON.stringify({ "orders": purchaseOrders }, null, 2));
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

router.options('/:number', (req, res) => {
    setHeaders(res);
    res.statusCode = 200; //OK
    res.end();
});

router.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    purchaseOrdersReader(res);
    res.send(purchaseOrders);
});

router.get('/:number', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    purchaseOrdersReader(res);
    const order = purchaseOrders.find(o => o.number === parseInt(req.params.number));
    if (!order) return res.status(404).send("N\u00FAmero de orden ingresado no encontrado");
    res.send(order);
});

router.get('/:number/products', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    purchaseOrdersReader(res);
    const order = purchaseOrders.find(o => o.number === parseInt(req.params.number));
    if (!order) return res.status(404).send("N\u00FAmero de orden ingresado no encontrado");
    res.send(order.products);
});

router.post('/', (req, res) => {
    setHeaders(res);
    purchaseOrdersReader(res);

    const schema = Joi.object({
        products: Joi.array().default([]).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ "error": error.details[0].message }); //Bad request

    const date = new Date();
    const order = {
        number: purchaseOrders.length + 1,
        date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
        products: req.body.products
    }

    if (inventory.addProducts(res, order.number, order.products)) {
        purchaseOrders[purchaseOrders.length] = order;
        purchaseOrdersWriter(res);
        res.send(order);
    }
});