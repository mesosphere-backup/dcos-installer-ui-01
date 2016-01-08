import AppDispatcher from './AppDispatcher';

const InstallerActions = {
  setNextStep: function (data) {
    AppDispatcher.handleGlobalAction({
      type: ActionTypes.GLOBAL_SET_NEXT_STEP,
      data
    });
  }
};

module.exports = InstallerActions;
