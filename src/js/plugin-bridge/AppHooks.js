module.exports = {
  actions: ['pluginsConfigured'],

  filters: [],

  initialize(SDK) {
    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });
    this.filters.forEach(filter => {
      SDK.Hooks.addFilter(filter, this[filter].bind(this));
    });

    this.SDK = SDK;
  },

  pluginsConfigured() {
    // Filter the Application's configuration
    this.SDK.Hooks.applyFilter('applicationConfiguration', this.SDK.config);
  }
};
