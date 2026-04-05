// Manual mock for src/apiClient.js — CommonJS so Jest can load it without ESM issues.
const api = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

module.exports = api;
module.exports.default = api;

