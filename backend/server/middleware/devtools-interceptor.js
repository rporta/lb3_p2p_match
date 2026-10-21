'use strict';

module.exports = function() {
  return function(req, res, next) {
    if (req.path === '/.well-known/appspecific/com.chrome.devtools.json') {
      return res.status(204).end();
    }
    next();
  };
};