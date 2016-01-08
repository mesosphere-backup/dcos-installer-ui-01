let ActionTypes = {};
[
  'DEPLOY_UPDATE_ERROR',
  'DEPLOY_UPDATE_SUCCESS',
  'GLOBAL_ACTION',
  'GLOBAL_SET_INSTALL_IN_PROGRESS',
  'GLOBAL_SET_NEXT_STEP',
  'PREFLIGHT_UPDATE_ERROR',
  'PREFLIGHT_UPDATE_SUCCESS',
  'SETUP_RECEIVE_USER_INPUT'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;
