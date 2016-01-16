let Config = {
  apiPrefix: '/api/v1/',
  rootUrl: ''
};

if (Config.environment === 'development') {
  var Util = require('../utils/Util');
  var ConfigDev = require('./Config.dev.js');

  Config = Util.extend(Config, ConfigDev);
}

module.exports = Config;
