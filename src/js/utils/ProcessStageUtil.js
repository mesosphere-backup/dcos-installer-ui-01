import _ from 'lodash';

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
    var errors = hostState.commands.reduce(function (total, cmd) {
      return total.concat(cmd.stdout.filter(function (line) { return line.includes('FAIL')}));
    }, []);
    errors = errors.map(function (error) {
      return {host, message: error};
    });
    state.errorDetails.push({host, errors});
  }

  if (hostStatus === 'running') {
    stateType.completed = false;
  }

  stateType[`total${StringUtil.capitalize(role)}s`] += 1;
}

const ProcessStageUtil = {
  processState(response) {
    console.log('resp', response, response == {});
    if (Object.keys(response).length === 0) {
      console.log('yoyo');
      return response;
    }

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
      var role;

      if (!hostStatus.tags) {
        role = 'agent';
      } else {
        role = hostStatus.tags.role;
      }

      if (chainName === 'deploy') {
        processDeployHostState(hostStatus, host, role, state);
      } else {
        processFlightHostState(hostStatus, host, role, state);
      }
    });
    console.log(state);
    return state;
  }
};

module.exports = ProcessStageUtil;
