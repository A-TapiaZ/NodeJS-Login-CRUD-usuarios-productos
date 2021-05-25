const Products = require('../../models/productModel');

const createProduct= async (req, res) => {
  try {
    console.log(req.body);
    let producto= new Products({title,desc,price,images,user}=req.body);
    console.log(producto, 'hola');
    await producto.save();
    res.send({status:'OK', message: 'Product created'})
  } catch (error) {
    console.log('Error creating product',error);
    res.status(500).send({status:'Error de product controller', message: error.message}); 
  }
}

const deleteProduct=async (req, res) => {
  
}

const getProducts= async (req, res) => {
  try {
    // Usamos populate para "CONCATENAR" los datos que tienen las dos tablas en comun. Para este caso, como cuando registramos el producto, registramos el id del usuario que lo registro, podemos traer tambien toda la informacion del usuario con el metodo 'populate' pasandole el dato en comun, en este caso el ID.
    const products= await Products.find({price:{$gt:1}}).populate('user').select( )
    res.send({status:'OK', data: products})
  } catch (error) {
    console.log('Error creating product',error);
    res.status(500).send({status:'Error de product controller', message: error.message}); 
  }
}

const getProductsByUser=async (req, res) => {
  try {
    console.log(req.params);
    const products= await Products.find(req.params).select( )
    res.send({status:'OK', data: products})

  } catch (error) {
    console.log('Error creating product',error);
    res.status(500).send({status:'Error de product controller', message: error.message}); 
  }
}


module.exports={createProduct, deleteProduct, getProducts,getProductsByUser }