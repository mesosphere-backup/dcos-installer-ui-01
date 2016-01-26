import Config from '../config/Config';
import StringUtil from './StringUtil';

function getStdout(stdout) {
  let failedLines = stdout.filter(function (line) {
    return line.indexOf('FAIL') > -1;
  });

  if (failedLines.length === 0) {
    return stdout;
  }

  return failedLines;
}

function getErrors(commands) {
  var errors = commands.reduce(function (total, cmd) {
    let stdout = getStdout(cmd.stdout);
    let output = stdout.concat(cmd.stderr);
    return total.concat(output.filter(function (line) { return line !== ''}));
  }, []);

  var errorMap = {};

  errors.forEach(function (line) {
    errorMap[line] = true;
  });
  return Object.keys(errorMap).join('\n');
}

function processDeployHostState(hostState, host, role, state) {
  let stateType = state[`${role}s`];
  let hostStatus = hostState.host_status;
  stateType.totalStarted += 1;

  if (hostStatus === 'running') {
    stateType.completed = false;
  }

  if (hostStatus === 'failed') {
    stateType.errors += 1;

    var errors = getErrors(hostState.commands, host);
    state.errorDetails.push({host, message: errors});
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
    var errors = getErrors(hostState.commands, host);
    state.errorDetails.push({host, message: errors});
  }

  if (hostStatus === 'running') {
    stateType.completed = false;
  }

  stateType[`total${StringUtil.capitalize(role)}s`] += 1;
}

const ProcessStageUtil = {
  processState(response) {
    let state = {
      agents: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalAgents: 0
      },
      errorDetails: [],
      masters: {
        completed: true,
        errors: 0,
        totalStarted: 0,
        totalMasters: 0
      }
    };

    if (Object.keys(response).length === 0) {
      return state;
    }

    let chainName = response.chain_name;

    if (chainName === 'deploy') {
      state.agents.totalAgents = response.total_agents;
      state.masters.totalMasters = response.total_masters;
    }

    Object.keys(response.hosts || {}).forEach(function (host) {
      let hostStatus = response.hosts[host];

      if (typeof hostStatus !== 'object') {
        return;
      }
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

    return state;
  },

  getLogsURL() {
    return `${Config.rootUrl}${Config.apiPrefix}logs`;
  }
};

module.exports = ProcessStageUtil;
