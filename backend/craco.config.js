const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "path": require.resolve("path-browserify"),
        "url": require.resolve("url"),
        "process": require.resolve("process/browser.js"),  
        "buffer": require.resolve("buffer/")
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',  
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return config;
    }
  },
  devServer: {
    allowedHosts: 'all'
  }
};
