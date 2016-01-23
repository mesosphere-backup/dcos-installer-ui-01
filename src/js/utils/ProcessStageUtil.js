import StringUtil from './StringUtil';

function processDeployHostState(hostState, host, role, state) {
  let stateType = state[`${role}s`];
  let hostStatus = hostState.host_status;
  stateType.totalStarted += 1;

  if (hostStatus === 'running') {
    stateType.completed = false;
  }

  if (hostStatus === 'failed') {
    stateType.errors += 1;
    state.errorDetails.push({host, errors: hostState.stderr});
  }
}

function processFlightHostState(hostState, host, role, state) {
  let stateType = state[`${role}s`];
  let hostStatus = hostState.host_status;

  if (hostStatus === 'failed' || hostStatus === 'success') {
    stateType.totalStarted += 1;
  }

  if (hostStatus === 'failed') {
    stateType.errors += 1;
    state.errorDetails.push({host, errors: hostState.stderr});
  }

  if (hostStatus === 'running') {
    stateType.completed = false;
  }

  stateType[`total${StringUtil.capitalize(role)}s`] += 1;
}

const ProcessStageUtil = {
  processState(response) {
    let chainName = response.chain_name;

    let totalSlaves = 0;
    let totalMasters = 0;

    if (chainName === 'deploy') {
      totalSlaves = response.total_agents;
      totalMasters = response.total_masters;
    }

    let state = {
      slaves: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalSlaves
      },
      errorDetails: [],
      masters: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalMasters
      }
    };

    Object.keys(response.hosts).forEach(function (host) {
      let hostStatus = response[host];

      if (typeof hostStatus !== 'object') {
        return;
      }

      if (chainName === 'deploy') {
        processDeployHostState(hostStatus, host, hostStatus.tags.role, state);
      } else {
        processFlightHostState(hostStatus, host, hostStatus.tags.role, state);
      }
    });

    return state;
  }
};

module.exports = ProcessStageUtil;
