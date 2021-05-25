const mongoose = require('mongoose');

const {Schema}=mongoose;

const productSchema= new Schema ({
  title:{
    type:String, 
    required:true},
  
  desc:{
    type:String, 
    required:true}, 
  
  price:{
    type:Number,
    required:true},
  
  images:{
    type:[{type:String,
      required:true}],
    default:[]
  },
  // Esta propiedad es la que usamos en populate cuando traemos toda la informaciion de la BD
  user:{
    type:mongoose.Schema.Types.ObjectId, 
    ref:'User',
    required:true}
  // OJO, creamos otro objeto para el timestamps.
  },{
    timestamps:true
});


const model= mongoose.model('Product', productSchema);
module.exports=model;