import StringUtil from './StringUtil';

function processDeployHostState(hostState, host, role, state) {

  let stateType = state[`${role}s`];
  let hostStatus = hostState.host_status;
  console.log('in here', stateType, hostStatus);
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

    let totalAgents = 0;
    let totalMasters = 0;

    if (chainName === 'deploy') {
      totalAgents = response.total_agents;
      totalMasters = response.total_masters;
    }

    let state = {
      agents: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalAgents
      },
      errorDetails: [],
      masters: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalMasters
      }
    };

    Object.keys(response.hosts || {}).forEach(function (host) {
      let hostStatus = response.hosts[host];

      // if (typeof hostStatus !== 'object') {
      //   return;
      // }
      var role = 'agent';
      if (chainName === 'deploy') {
        processDeployHostState(hostStatus, host, hostStatus.tags.role, state);
      } else {
        processFlightHostState(hostStatus, host, hostStatus.tags.role, state);
      }
    });
    console.log(state);
    return state;
  }
};

module.exports = ProcessStageUtil;
