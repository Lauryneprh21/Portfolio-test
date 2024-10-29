const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://portfolio-test-1-r0vs.onrender.com',
      changeOrigin: true,
    })
  );
};
