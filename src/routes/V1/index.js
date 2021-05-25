const productRoutes = require('./productsRoutes');
const userRoutes = require('./usersRoutes');

module.exports= (app) => {
  app.use('/api/v1/users',userRoutes)
  app.use('/api/v1/products',productRoutes)
}
