const express = require('express'); 
const app = express();

let cors = require('cors');
app.use(cors());

//Settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//Middlewares
app.use(express.json());

//Routes
app.use('/api/log-in', require('./routes/logIn'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/requisitions', require('./routes/requisitions'));
app.use('/api/purchase-orders', require('./routes/purchaseOrders'));

//Port listening
app.listen(app.get('port'), () => console.log(`Listening on port ${app.get('port')}`));