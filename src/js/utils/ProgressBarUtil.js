const ProgressBarUtil = {
  getPercentage: function (totalStarted, totalOfType, type, store) {
    var totalRunning = store.get(`${type.toLowerCase()}s`).totalRunning;
    var totalCompleted = totalStarted - totalRunning;

    var progressValue = (totalRunning * 0.5) + totalCompleted;

    var percentage = ((progressValue / totalOfType) * 100) || 0;

    if (percentage === 100 && !store[`is${type}Completed`]()) {
      percentage = 99;
    }

    return percentage;
  }
};

module.exports = ProgressBarUtil;
