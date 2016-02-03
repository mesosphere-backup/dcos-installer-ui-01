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

  // Deconstruct this on load as well.
  getCombinedZKHosts(hosts, port) {
    // Remove all whitespace, split into array, create new array in format of
    // host:port, and convert back to string.
    if (hosts === '' || hosts == null) {
      return hosts;
    }

    return this.getArrayFromHostsString(hosts).map(function (host) {
      return `${host}:${port}`;
    }).join(', ');
  },

  getSeparatedZKHostData(hostData) {
    if (hostData == null || hostData === '') {
      return {
        zkExhibitorHosts: null,
        zkExhibitorPort: null
      };
    }

    let hosts = this.getArrayFromHostsString(hostData);
    let port = hosts[0].split(':')[1];

    hosts.forEach(function (host, index) {
      hosts[index] = host.split(':')[0];
    });

    return {
      zkExhibitorHosts: this.getStringFromHostsArray(hosts),
      zkExhibitorPort: port
    };
  },

  prepareDataForAPI(newFormData, oldFormData) {
    let preparedData = {};

    Object.keys(newFormData).forEach((key) => {
      // For zk_exhibitor_hosts and zk_exhibitor_port, we need to send a
      // string with comma-separated host:port values.
      // For master_list and agent_list, we need to send an array of the IPs.
      // Everything else can be sent as entered by the user.
      if (key === 'zk_exhibitor_hosts') {
        if (oldFormData.zk_exhibitor_hosts != null) {
          preparedData.exhibitor_zk_hosts = SetupUtil.getCombinedZKHosts(
            newFormData[key], oldFormData.zk_exhibitor_port
          );
        }
      } else if (key === 'zk_exhibitor_port') {
        if (oldFormData.zk_exhibitor_hosts != null) {
          preparedData.exhibitor_zk_hosts = SetupUtil.getCombinedZKHosts(
            oldFormData.zk_exhibitor_hosts, newFormData[key]
          );
        }
      } else if (key === 'master_list' || key === 'agent_list'
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
