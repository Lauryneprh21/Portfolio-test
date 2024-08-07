const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://portfolio-backend12-0c9d56b67de9.herokuapp.com',
      changeOrigin: true,
    })
  );
};
