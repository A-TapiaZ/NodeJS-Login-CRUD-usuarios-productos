const mongoose = require('mongoose');

const {Schema}=mongoose;

const userSchema= new Schema ({
  username:{
    type:String, 
    required:true,
    unique:true},
  
  password:{
    type:String, 
    required:true}, 
  
  email:{
    type:String,
    required:true,
    unique:true},
  
  data:{
    type:{
      age:Number,
      isMale:Boolean}
  },
  role:{
    type: String,
    enum:['admin', 'seller'],
    default:'seller'
  }
});

// Se supone que el nombre de la tabla deberia ser User, pero mongo automaticamente lo convierte a minusculas y ademas lo vuelve plurar. Por lo que cuando consultemos el nombre de la tabla en la BD no va a ser 'User' sino 'users'.
const model= mongoose.model('User', userSchema);
module.exports=model;