const express= require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routesV1 = require('./routes/V1');
const mongoose = require('mongoose');

// habilita la lectura de vbles de entorno
dotenv.config();
const app = express();

// Imprimi las vbles de entorno, solo para que chequear que esten bien;
// console.log('PORT',process.env.PORT);
// console.log('MONGO',process.env.MONGO);


// Implementamos el body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

routesV1(app);

// Definimos una vble con el valor desde la vble de entorno, que en caso tal que no reciba ningun valor toma por defecto el valor 3000;
const PORT= process.env.PORT || 3000;

// Nos conectamos a la BD de Mongo
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
})
.then((result) => {
  console.log('Connected to Mongo');
}).catch((err) => {
  console.log('Connection error to Mongo', err);
});

app.listen(PORT, () => {
  console.log(`Todo bien, funcionando desde ${PORT}`);  
});

