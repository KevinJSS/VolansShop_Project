const { Router } = require('express');
const router = Router();

module.exports = router;

const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

const filePath = 'data/registered-users.json';
let userList;

function userListReader(res) {
    let fileData;
    try {
        fileData = fs.readFileSync(filePath);
    } catch (error) {
        return res.status(404).send({ "error": "Datos del archivo no encontrados." });
    }

    try {
        userList = JSON.parse(fileData).users;
    } catch (error) {
        return res.status(404).send({ "error": "El archivo JSON contiene errores" });
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

router.get('/', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    userListReader(res);
    verifyUser(req.query.username.toLocaleLowerCase(), req.query.password, res);
});

function verifyUser(username, password, res) {
    user = userList.find(u => u.username === username);
    if (!user) {
        res.status(400).send({ "error": "Nombre de usuario incorrecto"});
    } else if (user.password !== password) {
        res.status(400).send({ "error": "Contrase\u00F1a incorrecta."});
    } else {
        res.send("Usuario verificado");
    }
}