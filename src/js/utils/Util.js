/*
 * From: https://raw.githubusercontent.com/angus-c/es6-react-mixins/master/src/mixin.js
 * Based on: https://gist.github.com/sebmarkbage/fac0830dbb13ccbff596
 * by Sebastian Markbåge
 *
 * This is not the original file, and has been modified
 */

import _ from "underscore";
import React from "react";

let lifecycleFunctions = [
  "componentWillMount", "componentDidMount",
  "componentWillReceiveProps", "componentWillUpdate", "componentDidUpdate",
  "componentWillUnmount", "render"
];

function noop() {
  return null;
}
function trueNoop() {
  return true;
}

function es6ify(mixin) {
  if (typeof mixin === "function") {
    // mixin is already es6 style
    return mixin;
  }

  return function (Base) {
    // mixin is old-react style plain object
    // convert to ES6 class
    class MixinClass extends Base {}

    const clonedMixin = _.extend({}, mixin);
    // These React properties are defined as ES7 class static properties
    let staticProps = [
      "childContextTypes", "contextTypes",
      "defaultProps", "propTypes"
    ];
    staticProps.forEach(function (staticProp) {
      MixinClass[staticProp] = clonedMixin[staticProp];
      delete clonedMixin[staticProp];
    });

    // Omit lifecycle functions because we are already storing them elsewhere
    _.extend(MixinClass.prototype, _.omit(clonedMixin, lifecycleFunctions));

    return MixinClass;
  };
}

function setLifecycleMixinHandler(proto, lifecycleFn, mixins) {
  if (mixins == null || mixins.length === 0) {
    // No-ops so we need not check before calling super()
    proto[lifecycleFn] = noop;
    return;
  }

  proto[lifecycleFn] = function (...args) {
    mixins.forEach((mixin) => {
      mixin.apply(this, args);
    });
  };
}

function addLifeCycleFunctions(proto, mixins) {
  let mixinLifecycleFnMap = {};
  mixins.forEach(function (mixin) {
    lifecycleFunctions.forEach(function (lifecycleFn) {
      if (mixin[lifecycleFn] == null) {
        return;
      }

      if (mixinLifecycleFnMap[lifecycleFn] == null) {
        mixinLifecycleFnMap[lifecycleFn] = [];
      }

      // Use push as we want to preserve order
      mixinLifecycleFnMap[lifecycleFn].push(mixin[lifecycleFn]);
    });
  });

  lifecycleFunctions.forEach(function (lifecycleFn) {
    setLifecycleMixinHandler(
      proto, lifecycleFn, mixinLifecycleFnMap[lifecycleFn]
    );
  });
}

const Util = {
  mixin: function (...mixins) {
    // Creates base class
    class Base extends React.Component {}

    Base.prototype.shouldComponentUpdate = trueNoop;
    addLifeCycleFunctions(Base.prototype, mixins);

    mixins.reverse();

    mixins.forEach(function (mixin) {
      Base = es6ify(mixin)(Base);
    });

    return Base;
  }
};

export default Util;
