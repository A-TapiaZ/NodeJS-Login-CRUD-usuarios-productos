const bcrypt = require('bcrypt');
const User= require('../../models/userModel')
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const Products = require('../../models/productModel');


const login =async (req,res) => {
  try {
    const {email, password} =req.body;
    // El metodo findOne retorna el primer resultado que coincida con mi busqueda
    const user = await User.findOne({email});
    // Si el usuario existe
    if (user) {
      // comprobamos la contraseña
      const passIsOk= await bcrypt.compare(password, user.password);
      // Si la contraseña es CORRECTA
      if (passIsOk) {
        // JSONTOKEN 
        const token=jwt.sign({userId:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:'5h'})
        res.send({status:'OK', data:{token,expiresIn:'5h'}});
      // Si la contraseña es INCORRECTA
      } else {
          res.status(403).send({status:'Invalid_Password', message: ''});
      }
      // Si NO EXISTE el usuario
    } else {
      res.status(401).send({status:'User_Not_Found   ', message:''});
    }
    // En caso de ERROR
  } catch (error) {
    res.status(500).send({status:'Error', message: error.message});
  }
}

const createUser= async(req, res) => {
  try {
    
    // Existen dos formas de enviar la informaciona  la BD.
    
    /*// Option 1
    const {username, email,password,data}=req.body;
    const hash= await bcrypt.hash(password, 15);
    await User.create({
      // como las vbles se llaman igual que los campos de la BD, no es necesario definirlo como un objeto, de lo contrario tocaria usar el nombre del campo y luego el nombre de la vble(i.e. username:nombreUsuario)
      // En el caso de password se da lo que se mencionaba antes.
      username,
      email,
      data,
      password:hash
    })*/

    // Option 2 
    const {username,email,role,password,data}=req.body;
    const hash= await bcrypt.hash(password, 15);
    let usuario= new User({username,email,role,password:hash,data});
    await usuario.save();

    res.send({status:'OK', message: 'User created'})
  } catch (error) {

    if (error.code && error.code===11000) {
      res.status(400).send({status:'DUPLICATED VALUES', message: error.keyValue});
      return;
    } 
    res.status(500).send({status:'Error de controller', message: error.message});
  }
}

const deleteUser= async (req, res) => {
  try {
    const {user}=req.body;
   
    if (!user) {
      throw new Error('Missing param userID')
      
    }
   
    await User.findByIdAndDelete(user);

    await Products.deleteMany({user})
    res.send({status:'OK', message: 'User deleted'})


  } catch (error) {

    res.status(500).send({status:'Error', message: error.message});
  }
}

const getUsers= async (req, res) => {
  try {
    const users= await User.find().select({password:0, __v:0,role:0});
    res.send({status:'OK', data: users})
    
  } catch (error) {
    res.status(500).send({status:'Error', message: error.message});
  }  
  
}

const updateUser= async (req, res) => {
  try {
    // Aqui recibiria la informacion desde el middelware (req.sessiondata), y esta la usaria para buscar al mismo usuario que se logueo, con el fin que solo el ussuario que se logueo pueda modificar sus propios datos. En este caso no lo hare ya que quiero que una cuenta con el rol de administrador pueda modificar o actualizar los datos de las otras cuentas.
    // console.log('req.sessionData', req.sessionData.userId);
    const {username,email,password,data,user}=req.body;
    // Pasamos el user para saber a quien actualizar, y entre llaves los valores que queremos actualizar
    await User.findByIdAndUpdate(user,{username,data});
    res.send({status:'OK', message:'User updated'})
  } catch (error) {
    if (error.code && error.code===11000) {
      res.status(400).send({status:'DUPLICATED VALUES', message: error.keyValue});
      return;
    }
    res.status(500).send({status:'Error', message:'User updated'})
  }
}


module.exports = {
  login,
  createUser,
  deleteUser,
  getUsers,
  updateUser
}