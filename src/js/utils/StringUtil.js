const StringUtil = {
  capitalize: function (string) {
    if (typeof string !== 'string') {
      return null;
    }

    return string.charAt(0).toUpperCase() + string.slice(1, string.length);
  },

  removeANSI: function (string) {
    return string.replace(/\[[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  }
}

module.exports = StringUtil;
