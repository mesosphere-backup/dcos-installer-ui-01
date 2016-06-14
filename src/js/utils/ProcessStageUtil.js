import Config from '../config/Config';
import NodeStatuses from '../constants/NodeStatuses';

const DEFAULT_ERROR = 'An unknown error occurred.';

function getErrorsFromStdout(stdout) {
  let failedLines = stdout.filter(function (line) {
    return line.indexOf('FAIL') > -1;
  });

  if (failedLines.length === 0) {
    return stdout;
  }

  return failedLines;
}

function getErrors(commands) {
  let errors = commands.reduce(function (total, cmd) {
    let stdout = getErrorsFromStdout(cmd.stdout);
    let output = stdout.concat(cmd.stderr);
    return total.concat(output.filter(function (line) { return line !== ''}));
  }, []);

  let errorMap = {};

  errors.forEach(function (line) {
    errorMap[line] = true;
  });

  if (Object.keys(errorMap).length === 0) {
    return DEFAULT_ERROR;
  }

  return Object.keys(errorMap).join('\n');
}

function getIPComponents(ip = '') {
  let colonIndex = ip.indexOf(':');

  if (colonIndex === -1) {
    return {ip, port: null};
  }

  return {
    ip: ip.substring(0, colonIndex),
    port: ip.substring(colonIndex + 1, ip.length)
  };
}

function getStage(commands) {
  let lastCommand = commands[commands.length - 1];

  if (!!lastCommand && !!lastCommand.stage) {
    return lastCommand.stage;
  }

  return 'Not running';
}

function processHostState(hostData, host, role, state) {
  let errors = null;
  let hostStatus = hostData.host_status;
  let isCompleted = true;
  let {ip, port} = getIPComponents(host);
  let stageStatus = getStage(hostData.commands);

  state.startedCount += 1;
  state[`${role}Count`] += 1;

  if (hostStatus === NodeStatuses.RUNNING) {
    state.runningCount += 1;
    isCompleted = false;
  }

  if (hostStatus === NodeStatuses.UNSTARTED) {
    isCompleted = false;
  }

  if (hostStatus === NodeStatuses.SUCCESS) {
    state.successCount += 1;
    stageStatus = 'Success';
  }

  if (hostStatus === NodeStatuses.FAILED
    || hostStatus === NodeStatuses.TERMINATED) {
    errors = getErrors(hostData.commands, host);
    state.errorCount += 1;
    state[`${role}ErrorCount`] += 1;
    state.errorDetails.push({host, message: errors});
    stageStatus = 'Failed';
  }

  state.nodes.push({
    errors,
    ip,
    port,
    role,
    status: hostStatus,
    stage: stageStatus
  });

  return isCompleted;
}

const ProcessStageUtil = {
  processState(response) {
    let state = {
      agentCount: 0,
      agentErrorCount: 0,
      completed: false,
      errorCount: 0,
      errorDetails: [],
      masterCount: 0,
      masterErrorCount: 0,
      nodes: [],
      runningCount: 0,
      startedCount: 0,
      successCount: 0,
      totalHosts: response.total_hosts || 0
    };

    let isStageCompleted = true;

    if (Object.keys(response).length === 0) {
      return state;
    }

    Object.keys(response.hosts || {}).forEach(function (host) {
      let hostStatus = response.hosts[host];

      if (typeof hostStatus !== 'object') {
        return;
      }

      let role;

      if (!hostStatus.tags) {
        role = 'agent';
      } else {
        role = hostStatus.tags.role;
      }

      if (role === 'public_agent') {
        role = 'agent';
      }

      let isNodeCompleted = processHostState(hostStatus, host, role, state);

      if (!isNodeCompleted) {
        isStageCompleted = false;
      }
    });

    state.completed = isStageCompleted;

    return state;
  },

  getLogsURL() {
    return `${Config.rootUrl}${Config.apiPrefix}logs`;
  }
};

module.exports = ProcessStageUtil;
