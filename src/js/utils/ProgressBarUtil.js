const ProgressBarUtil = {
  getPercentage: function (totalStarted, totalOfType, type, store) {
    var percentage = ((totalStarted / totalOfType) * 100) || 0;

    if (percentage === 100 && !store[`is${type}Completed`]()) {
      percentage = 99;
    }

    return percentage;
  }
};

module.exports = ProgressBarUtil;
