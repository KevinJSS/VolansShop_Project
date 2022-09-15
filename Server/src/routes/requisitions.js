const { Router } = require('express');
const router = Router();

module.exports = router;

const inventory = require('./inventory.js');
const Joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs')

app.use(express.json());

const filePath = 'data/requisitions.json';
let requisitions;

function requisitionsReader(res) {
    let fileData;
    try {
        fileData = fs.readFileSync(filePath);
    } catch (error) {
        return res.status(404).send({ "error": "Datos del archivo no encontrados." });
    }

    try {
        requisitions = JSON.parse(fileData).requisitions;
    } catch (error) {
        return res.status(404).send({ "error": "El archivo JSON contiene errores" });
    }
}

function requisitionsWriter(res) {
    try {
        fs.writeFileSync(filePath, JSON.stringify({ "requisitions": requisitions }, null, 2));
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
    requisitionsReader(res);
    res.send(requisitions);
});

router.get('/:number', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    requisitionsReader(res);
    const requisition = requisitions.find(o => o.number === parseInt(req.params.number));
    if (!requisition) return res.status(404).send("N\u00FAmero de requisici\u00f3n ingresado no encontrado");
    res.send(requisition);
});

router.get('/:number/products', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    requisitionsReader(res);
    const requisition = requisitions.find(o => o.number === parseInt(req.params.number));
    if (!requisition) return res.status(404).send("N\u00FAmero de requisici\u00f3n ingresado no encontrado");
    res.send(requisition.products);
});

router.post('/', (req, res) => {
    setHeaders(res);
    requisitionsReader(res);

    const schema = Joi.object({
        products: Joi.array().default([]).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ "error": error.details[0].message }); //Bad request

    const date = new Date();
    const requisition = {
        number: requisitions.length + 1,
        date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
        products: req.body.products
    }
    
    if (inventory.removeProducts(res, requisition.number, requisition.products)) {
        requisitions[requisitions.length] = requisition;
        requisitionsWriter(res);
        res.send(requisition);
    }
});