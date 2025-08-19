module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: false,
    https: false,
    util: false,
    url: false,
    buffer: false,
  };
  return config;
};
