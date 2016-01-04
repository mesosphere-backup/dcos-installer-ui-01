import _ from "underscore";

import StringUtil from "../utils/StringUtil";

const LISTENER_SUFFIX = "ListenerFn";

const ListenersDescription = {
  // Add stores here

  // Example store
  // user: {
  //   store: UserStoreHere,
  //   events: {
  //   },
  //   unmountWhen: function () {
  //   },
  //   listenAlways: true
  // }
};

const StoreMixin = {
  componentDidMount() {
    if (this.store_listeners) {
      // Create a map of listeners, becomes useful later
      let storesListeners = {};

      // Merges options for each store listener with
      // the ListenersDescription definition above
      this.store_listeners.forEach(function (listener) {
        if (typeof listener === "string") {
          // Use all defaults
          storesListeners[listener] = _.clone(ListenersDescription[listener]);
        } else {
          let storeName = listener.name;
          let events = listener.events;

          // Populate events by key. For example, a component
          // may only want to listen for "success" events
          if (events) {
            listener.events = {};
            events.forEach(function (event) {
              listener.events[event] =
                ListenersDescription[storeName].events[event];
            });
          }

          storesListeners[storeName] = _.defaults(
            listener, ListenersDescription[storeName]
          );
        }
      });

      this.store_listeners = storesListeners;
      this.store_addListeners();
    }
  },

  componentWillUnmount() {
    this.store_removeListeners();
  },

  store_addListeners() {
    Object.keys(this.store_listeners).forEach((storeID) => {
      let listenerDetail = this.store_listeners[storeID];

      // Loop through all available events
      Object.keys(listenerDetail.events).forEach((event) => {
        let eventListenerID = `${event}${LISTENER_SUFFIX}`;

        // Check to see if we are already listening for this event
        if (listenerDetail[eventListenerID]) {
          return;
        }

        // Create listener
        listenerDetail[eventListenerID] = this.store_onStoreChange.bind(
          this, storeID, event
        );

        // Set up listener with store
        listenerDetail.store.addChangeListener(
          listenerDetail.events[event], listenerDetail[eventListenerID]
        );
      });
    });
  },

  store_removeListeners() {
    Object.keys(this.store_listeners).forEach((storeID) => {
      let listenerDetail = this.store_listeners[storeID];

      // Loop through all available events
      Object.keys(listenerDetail.events).forEach((event) => {
        this.store_removeEventListenerForStoreID(storeID, event);
      });
    });
  },

  store_removeEventListenerForStoreID(storeID, event) {
    let listenerDetail = this.store_listeners[storeID];
    let eventListenerID = `${event}${LISTENER_SUFFIX}`;

    // Return if there was no listener setup
    if (!listenerDetail[eventListenerID]) {
      return;
    }

    listenerDetail.store.removeChangeListener(
      listenerDetail.events[event], listenerDetail[eventListenerID]
    );

    listenerDetail[eventListenerID] = null;
  },

  /**
   * This is a callback that will be invoked when stores emit a change event
   *
   * @param  {String} storeID The id of a store
   * @param  {String} event Normally a string containing success|error
   */
  store_onStoreChange(storeID, event, ...args) {
    // See if we need to remove our change listener
    let listenerDetail = this.store_listeners[storeID];
    // Maybe remove listener
    if (listenerDetail.unmountWhen && !listenerDetail.listenAlways) {
      // Remove change listener if the settings want to unmount after a certain
      // condition is truthy
      if (listenerDetail.unmountWhen(listenerDetail.store, event)) {
        this.store_removeEventListenerForStoreID(storeID, event);
      }
    }

    // Call callback on component that implements mixin if it exists
    let onChangeFn = this.store_getChangeFunctionName(
      listenerDetail.store.storeID, event
    );

    if (this[onChangeFn]) {
      this[onChangeFn].apply(this, args);
    }

    // Always forceUpdate no matter where the change came from
    this.forceUpdate();
  },

  store_getChangeFunctionName(storeID, event) {
    let storeName = StringUtil.capitalize(storeID);
    let eventName = StringUtil.capitalize(event);

    return `on${storeName}Store${eventName}`;
  }
};

module.exports = StoreMixin;
