// config-overrides.js
const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve = config.resolve || {};
  config.plugins = config.plugins || [];

  // ---- Key fix for xlsx ESM: ensure process/browser.js resolves ----
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    process: require.resolve("process/browser.js"),
  };

  // Webpack 5 fallbacks for Node core deps used by @react-pdf / blob-stream / restructure / xlsx
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    buffer: require.resolve("buffer"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
    path: require.resolve("path-browserify"),
    process: require.resolve("process/browser.js"), // keep here too
    fs: false,
  };

  // Allow older ESM packages that omit extensions (helps with xlsx and @react-pdf)
  config.resolve.fullySpecified = false;

  // Fix for @react-pdf/renderer JSX runtime resolution
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Provide globals some libs expect
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: require.resolve("process/browser.js"),
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
