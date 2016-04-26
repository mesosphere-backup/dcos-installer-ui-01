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
      timeout: Config.requestTimeout
    });
  }
};

module.exports = SuccessActions;
