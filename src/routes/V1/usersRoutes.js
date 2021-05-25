const express = require('express');
const userController = require('../../controller/V1/usersController');
const {isAuth, isAdmin,isValidHostname} = require('../../middlewares/auth');
const router= express.Router();

// Si enviaramos la informacion por medio del metodo 'GET', la informacion ingresada como lo es el correo y la contraseña serian enviadas como un texto plano, la cual podria ser interceptada. Pero si tenemos habilidado SSL y usamos HTTPS es recomendable que si se va a enviar informacion sennsible se utilice el metodo POST.  
router.post('/login',userController.login); 
router.post('/create',userController.createUser);
router.post('/update',isValidHostname,isAuth,userController.updateUser);
router.post('/delete',isAuth,isAdmin,userController.deleteUser);
// Es bueno usar 'get' cuando la consulta no va a realizar cambios en la BD 
router.get('/get-all',isAuth,isAdmin,userController.getUsers);

module.exports=router;