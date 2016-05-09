import Config from '../config/Config';

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

function processHostState(hostState, host, role, state) {
  let stateType = state[`${role}s`];
  let hostStatus = hostState.host_status;

  stateType.totalStarted += 1;

  if (hostStatus === 'running') {
    stateType.totalRunning += 1;
    stateType.completed = false;
  }

  if (hostStatus === 'not_running') {
    stateType.completed = false;
  }

  if (hostStatus === 'failed' || hostStatus === 'terminated') {
    stateType.errors += 1;

    var errors = getErrors(hostState.commands, host);
    state.errorDetails.push({host, message: errors});
  }
}

const ProcessStageUtil = {
  processState(response) {
    let state = {
      agents: {
        completed: true,
        errors: 0,
        totalRunning: 0,
        totalStarted: 0,
        totalAgents: response.total_agents || 0
      },
      errorDetails: [],
      totalHosts: response.total_hosts || 0,
      masters: {
        completed: true,
        errors: 0,
        totalRunning: 0,
        totalStarted: 0,
        totalMasters: response.total_masters || 0
      }
    };

    if (Object.keys(response).length === 0) {
      return state;
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

      if (role === 'public_agent') {
        role = 'agent';
      }

      processHostState(hostStatus, host, role, state);
    });

    return state;
  },

  getLogsURL() {
    return `${Config.rootUrl}${Config.apiPrefix}logs`;
  }
};

module.exports = ProcessStageUtil;
