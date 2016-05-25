import {RequestUtil} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

const SuccessActions = {
  fetchDCOSURL: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}success`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.DCOS_UI_URL_CHANGE,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.DCOS_UI_URL_ERROR,
          data: xhr
        });
      },
      hangingRequestCallback: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.DCOS_UI_URL_ONGOING
        });
      },
      timeout: Config.requestTimeout
    });
  }
};

if (Config.useFixtures) {
  let success = require('../../../tests/_fixtures/config/success.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.SuccessActions = {
    fetchDCOSURL: {event: 'success', success: {response: success}}
  };

  Object.keys(global.actionTypes.SuccessActions).forEach(function (method) {
    SuccessActions[method] = RequestUtil.stubRequest(
      SuccessActions, 'SuccessActions', method
    );
  });
}

module.exports = SuccessActions;
