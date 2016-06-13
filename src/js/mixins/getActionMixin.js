import StageActions from '../events/StageActions';

function getActionMixin(stageID) {
  return {
    beginStage: StageActions.beginStage.bind(null, stageID),

    fetchLogs: StageActions.fetchLogs.bind(null, stageID),

    fetchStageStatus: StageActions.fetchStageStatus.bind(null, stageID),

    getPercentError: function () {
      let errorCount = this.get('errorCount') || 0;
      let totalHosts = this.get('totalHosts') || 0;

      return Number((errorCount / totalHosts * 100).toFixed(0));
    },

    getPercentSuccess: function () {
      let successCount = this.get('successCount');
      let totalHosts = this.get('totalHosts') || 0;

      return Number((successCount / totalHosts * 100).toFixed(0));
    },

    getInitialState: function () {
      return {
        agentCount: 0,
        agentErrorCount: 0,
        completed: false,
        errorCount: 0,
        errorDetails: [],
        masterCount: 0,
        masterErrorCount: 0,
        nodes: [],
        runningCount: 0,
        startedCount: 0,
        successCount: 0,
        totalHosts: 0
      };
    },

    isCompleted: function () {
      return this.get('completed');
    },

    isFailed: function () {
      let data = this.getSet_data || {};

      if (Object.keys(data).length === 0) {
        return false;
      }

      return this.get('masterErrorCount') > 0;
    }
  };
}

module.exports = getActionMixin;
