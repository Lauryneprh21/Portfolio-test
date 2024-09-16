const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  (config) => {
    config.resolve.fallback = {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url")
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },
  (config) => {
    if (!config.devServer) {
      config.devServer = {};
    }
    config.devServer.allowedHosts = [
      'localhost'
    ];
    return config;
  }
);
