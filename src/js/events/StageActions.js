import {RequestUtil} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

const StageActions = {
  fetchStageStatus: function (stage) {
    let capitalizedStage = stage.toUpperCase();
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/actions/${stage}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_UPDATE_SUCCESS`],
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_UPDATE_ERROR`],
          data: xhr
        });
      }
    });
  },

  beginStage: function (stage) {
    let capitalizedStage = stage.toUpperCase();
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/actions/${stage}`,
      method: 'post',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_BEGIN_SUCCESS`]
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_BEGIN_ERROR`],
          data: xhr
        });
      }
    });
  },

  fetchLogs: function (stage) {
    let capitalizedStage = stage.toUpperCase();
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/actions/${stage}/logs`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_LOGS_SUCCESS`],
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes[`${capitalizedStage}_LOGS_ERROR`],
          data: xhr
        });
      }
    });
  },

  fetchCurrentStage: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/actions/current`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CURRENT_STAGE_CHANGE_ERROR,
          data: xhr
        });
      }
    });
  }
};

module.exports = StageActions;
