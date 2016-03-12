const SetupUtil = {
  getArrayFromHostsString(string) {
    if (string === '' || string == null) {
      return string;
    }

    return string.replace(/[^0-9\.\,\:]/g,'').split(',');
  },

  getStringFromHostsArray(array) {
    return array.join(', ');
  },

  prepareDataForAPI(newFormData) {
    let preparedData = {};

    Object.keys(newFormData).forEach((key) => {
      // For master_list and agent_list, we need to send an array of the IPs.
      // Everything else can be sent as entered by the user.
      if (key === 'master_list' || key === 'agent_list'
        || key === 'resolvers') {
        preparedData[key] = SetupUtil.getArrayFromHostsString(newFormData[key]);
      } else if (key === 'ssh_port') {
        preparedData[key] = parseInt(newFormData[key]);
      } else {
        preparedData[key] = newFormData[key];
      }
    });

    return preparedData;
  }
}

module.exports = SetupUtil;
