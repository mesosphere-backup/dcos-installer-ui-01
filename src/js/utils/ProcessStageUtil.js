function processHostState(hostStatus, host, role, state) {
  let stateType = state[`${role}s`];

  stateType.total += 1;

  if (hostStatus.state === 'running') {
    stateType.completed = false;
  }

  if (hostStatus.state === 'error') {
    stateType.errors += 1;
    state.errorDetails.push({host, errors: hostStatus.stderr});
  }
}

const ProcessStageUtil = {
  processState(response) {
    let state = {
      slaves: {
        errors: 0,
        total: 0,
        completed: true
      },
      errorDetails: [],
      masters: {
        errors: 0,
        total: 0,
        completed: true
      }
    };

    Object.keys(response).forEach(function (host) {
      let hostStatus = response[host];
      processHostState(hostStatus, host, hostStatus.role, state);
    });

    return state;
  }
};

module.exports = ProcessStageUtil;
