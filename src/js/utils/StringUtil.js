import _ from "underscore";

const StringUtil = {
  capitalize: function (string) {
    if (typeof string !== "string") {
      return null;
    }

    return string.charAt(0).toUpperCase() + string.slice(1, string.length);
  }
};

export default StringUtil;
