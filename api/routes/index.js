const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');

exports.handler = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/categories', categoryRoutes);
};