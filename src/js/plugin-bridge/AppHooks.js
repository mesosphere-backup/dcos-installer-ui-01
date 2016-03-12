module.exports = {
  actions: [],

  filters: [],

  initialize(SDK) {
    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });
    this.filters.forEach(filter => {
      SDK.Hooks.addFilter(filter, this[filter].bind(this));
    });
  }
};
