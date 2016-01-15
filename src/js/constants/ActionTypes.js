let ActionTypes = {};
[
  'CONFIGURE_STATUS_CHANGE_ERROR',
  'CONFIGURE_STATUS_CHANGE_ERROR',
  'CONFIGURE_CHANGE_ERROR',
  'CONFIGURE_CHANGE_SUCCESS',
  'CONFIGURE_UPDATE_ERROR',
  'CONFIGURE_UPDATE_SUCCESS',
  'DEPLOY_UPDATE_ERROR',
  'DEPLOY_UPDATE_SUCCESS',
  'DEPLOY_LOGS_SUCCESS',
  'DEPLOY_LOGS_ERROR',
  'GLOBAL_ACTION',
  'POSTFLIGHT_UPDATE_ERROR',
  'POSTFLIGHT_UPDATE_SUCCESS',
  'POSTFLIGHT_LOGS_ERROR',
  'POSTFLIGHT_LOGS_SUCCESS',
  'PREFLIGHT_UPDATE_ERROR',
  'PREFLIGHT_UPDATE_SUCCESS',
  'PREFLIGHT_LOGS_ERROR',
  'PREFLIGHT_LOGS_SUCCESS',
  'SETUP_RECEIVE_USER_INPUT'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;