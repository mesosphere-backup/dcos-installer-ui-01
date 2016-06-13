import {RequestUtil} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

const StageActions = {
  fetchStageStatus: function (stage) {
    let capitalizedStage = stage.toUpperCase();
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}action/${stage}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_UPDATE_SUCCESS`],
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_UPDATE_ERROR`],
          data: RequestUtil.parseResponseBody(xhr)
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_UPDATE_ONGOING`]
        });
      },
      timeout: Config.requestTimeout
    });
  },

  beginStage: function (stage, data) {
    let capitalizedStage = stage.toUpperCase();
    let options = {
      url: `${Config.rootUrl}${Config.apiPrefix}action/${stage}`,
      method: 'post',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_BEGIN_SUCCESS`]
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_BEGIN_ERROR`],
          data: RequestUtil.parseResponseBody(xhr)
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_BEGIN_ONGOING`]
        });
      },
      timeout: Config.requestTimeout
    };

    if (data && data.retry && Object.keys(data).length === 1) {
      options.data = 'retry=true';
      options.contentType = 'application/x-www-form-urlencoded';
    }

    RequestUtil.json(options);
  },

  fetchLogs: function (stage) {
    let capitalizedStage = stage.toUpperCase();
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}action/${stage}/logs`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_LOGS_SUCCESS`],
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_LOGS_ERROR`],
          data: RequestUtil.parseResponseBody(xhr)
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_LOGS_ONGOING`]
        });
      },
      timeout: Config.requestTimeout
    });
  },

  fetchCurrentStage: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}action/current`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_ERROR,
          data: RequestUtil.parseResponseBody(xhr)
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_ONGOING,
          data: {
            response: RequestUtil.parseResponseBody(xhr)
          }
        });
      },
      timeout: Config.requestTimeout
    });
  }
};

if (Config.useFixtures) {
  let agentFail = require('../../../tests/_fixtures/stage-state-json/agent-fail.json');
  let allFail = require('../../../tests/_fixtures/stage-state-json/all-fail.json');
  let allRunning = require('../../../tests/_fixtures/stage-state-json/all-running.json');
  let allSuccess = require('../../../tests/_fixtures/stage-state-json/all-success.json');
  let masterFail = require('../../../tests/_fixtures/stage-state-json/master-fail.json');
  let someRunning = require('../../../tests/_fixtures/stage-state-json/some-running.json');
  let agentDetails = require('../../../tests/_fixtures/stage-state-json/agent-details.json');
  let success = {};

  let currentPageDeploy = require('../../../tests/_fixtures/current-page/deploy.json');
  let currentPageNull = require('../../../tests/_fixtures/current-page/null.json');
  let currentPagePostFlight = require('../../../tests/_fixtures/current-page/post-flight.json');
  let currentPagePreFlight = require('../../../tests/_fixtures/current-page/pre-flight.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.StageActions = {
    fetchStageStatus: {
      event: 'success',
      success: {
        response: agentDetails
      },
      responses: {
        agentDetails,
        agentFail,
        allFail,
        allRunning,
        allSuccess,
        masterFail,
        someRunning,
        success
      }
    },
    beginStage: {
      event: 'success',
      success: {
        response: success
      },
      responses: {
        success
      }
    },
    fetchLogs: {
      event: 'success',
      success: {
        response: success
      },
      responses: {
        success
      }
    },
    fetchCurrentStage: {
      event: 'success',
      success: {
        response: currentPageNull
      },
      responses: {
        currentPageNull,
        currentPageDeploy,
        currentPagePostFlight,
        currentPagePreFlight
      }
    }
  };

  Object.keys(global.actionTypes.StageActions).forEach(function (method) {
    StageActions[method] = RequestUtil.stubRequest(
      StageActions, 'StageActions', method
    );
  });
}

module.exports = StageActions;
