import _ from 'underscore';
import {Dispatcher} from 'flux';

import ActionTypes from '../constants/ActionTypes';

let AppDispatcher = _.extend(new Dispatcher(), {
  handleServerAction: function (action) {
    if (!action.type) {
      console.warn('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: ActionTypes.GLOBAL_ACTION,
      action: action
    });
  }
});

module.exports = AppDispatcher;
