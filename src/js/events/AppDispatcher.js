import _ from 'lodash';
import {Dispatcher} from 'flux';

import ActionTypes from '../constants/ActionTypes';

let AppDispatcher = _.extend(new Dispatcher(), {
  handleServerAction: function (action) {
    if (!action.type) {
      console.warn('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: ActionTypes.SERVER_ACTION,
      action: action
    });
  },

  handleUIAction: function (action) {
    if (!action.type) {
      console.warn('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: ActionTypes.UI_ACTION,
      action: action
    });
  }
});

module.exports = AppDispatcher;
