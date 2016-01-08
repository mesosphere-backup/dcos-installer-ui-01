let ActionTypes = {};
[
  'DEPLOY_UPDATE_ERROR',
  'DEPLOY_UPDATE_SUCCESS',
  'GLOBAL_ACTION',
  'PREFLIGHT_UPDATE_ERROR',
  'PREFLIGHT_UPDATE_SUCCESS',
  'SETUP_RECEIVE_USER_INPUT'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;
