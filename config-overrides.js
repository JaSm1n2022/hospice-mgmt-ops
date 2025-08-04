module.exports = function override(config) {
  config.output.chunkFormat = "array-push";

  return config;
};
