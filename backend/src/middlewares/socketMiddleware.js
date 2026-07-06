/**
 * Middleware para disponibilizar socket.io nos controllers
 */
const socketMiddleware = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};

module.exports = socketMiddleware;
