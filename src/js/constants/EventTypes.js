let EventTypes = {};
[
  'DEPLOY_STATE_CHANGE',
  'GLOBAL_INSTALL_IN_PROGRESS_CHANGE',
  'GLOBAL_NEXT_STEP_CHANGE',
  'PREFLIGHT_STATE_CHANGE',
  'POSTFLIGHT_STATE_CHANGE',
  'SETUP_USER_INPUT_VALIDATED'
].forEach(function (eventType) {
  EventTypes[eventType] = eventType;
});

module.exports = EventTypes;
