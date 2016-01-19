function processHostState(hostStatus, role, state) {
  let stateType = state[`${role}s`];

  let errorDetails = stateType.errorDetails;
  stateType.error += 1;
  stateType.errorDetails = errorDetails.concat(hostStatus.stderr);
  stateType.total += 1;
}

const ProcessStageUtil = {
  processState(response) {
    let state = {
      slaves: {
        error: 0,
        errorDetails: [],
        total: 0
      },
      // Flag to determine if stage is still running.
      completed: true,
      masters: {
        error: 0,
        errorDetails: [],
        total: 0
      }
    };

    Object.keys(response).forEach(function (host) {
      let hostStatus = response[host];

      if (hostStatus.state === 'running') {
        state.completed = false;
      }

      processHostState(hostStatus, hostStatus.role, state);
    });

    return state;
  }
};

module.exports = ProcessStageUtil;
