// Used to execute all asynchronous middleware operations
// This prevents UnhandledPromiseRejectionWarnings without
// needing to wrap every async operation in a try/catch
const wrapAsync = (fn) => (request, response, next) => {
  Promise.resolve(fn(request, response, next)).catch(next);
};

module.exports = wrapAsync;
