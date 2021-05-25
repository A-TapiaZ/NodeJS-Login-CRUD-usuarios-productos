const jwt = require('jsonwebtoken');
const express = require('express');

const isValidHostname = (req,res,next) => {
  const validHost=['localhost', '']
  if (validHost.includes(req.hostname)){
    next();
  } else {
    res.status(403).send({status:'ACCES_DENIED'})
  }
};

const isAuth = (req,res,next) => {
 try {
  const {token} = req.headers; 
  if (token) {
    // La data que me trae el JWT es la del usuario que se logueo en loggin, ya que ese es el token que estoy recibiendo y verificando que sea valido. 
    const data = jwt.verify(token,process.env.JWT_SECRET);
    console.log(data,'DATA');
    console.log(data.userId,'DATA_ID');
    // La data que trae el req.body es la solicitud de actualizacion que esta haciendo el usuario que se logueo antes, si el usuario es admin, va a permitir modificar la informacion de quien sea, por el contrario si no es admin e intenta modificar la informacion de otro usuario sera lanzada la excepcion (Entrara en el if). 
    console.log(req.body.user,'Req');
    if (data.userId!==req.body.user && data.role!=='admin') {
      throw {code:403,status:'ACCES_DENIED',message: 'Missing permission or invalid role'}
    }
    // Esta vble la creo yo para pasarla al userController, RECORDAR QUE DATA ES LA INFORMACION DE QUIEN SE LOGUEO, NO LA DEL USUARIO QUE QUIERO MODIFICAR. El nombre 'sessionData' se lo doy yo. Y esto se usaría en caso de que solo la misma persona dueña de la cuenta quiera modificar sus propios datos, ya no se tendria que realizar la verificacion anterior. 
    req.sessionData={userId:data.userId,role:data.role}
    next();
  } else {
    res.status(403).send({code:403,status:'ACCES_DENIED',message: 'Missing header token'})
    // throw {code:403,status:'ACCES_DENIED',message: 'Missing header token'}
  }
 } catch (error) {

  res.status(error.code || 500)
  .send({status: error.status || 'Error', 
  message: error.message})
 }
};

const isAdmin = (req,res,next) => {
  try {
    const {role}=req.sessionData;
    console.log('Is admin?',role);
    if (role!=='admin') {
      throw {code:403,status:'ACCES_DENIED',message: 'Missing permission or invalid role'}
    };
      next();
  } catch (error) {
   res.status(error.code || 500)
   .send({status: error.status || 'Error', 
   message: error.message})
  }
 };
module.exports= {isValidHostname,isAuth, isAdmin};