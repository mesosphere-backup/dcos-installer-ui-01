function processHostState(hostState, host, role, state) {
  let stateType = state[`${role}s`];
  let hostStatus = hostState.host_status;
  stateType.totalStarted += 1;

  if (hostStatus === 'running') {
    stateType.completed = false;
  }

  if (hostStatus === 'error') {
    stateType.errors += 1;
    state.errorDetails.push({host, errors: hostState.stderr});
  }
}

const ProcessStageUtil = {
  processState(response) {
    let state = {
      slaves: {
        completed: true,
        errors: 0,
        totalSlaves: response.total_slaves,
        totalStarted: 0
      },
      errorDetails: [],
      masters: {
        completed: true,
        errors: 0,
        totalMasters: response.total_masters,
        totalStarted: 0
      }
    };

    Object.keys(response.hosts).forEach(function (host) {
      let hostStatus = response[host];
      processHostState(hostStatus, host, hostStatus.tags.role, state);
    });

    return state;
  }
};

module.exports = ProcessStageUtil;
