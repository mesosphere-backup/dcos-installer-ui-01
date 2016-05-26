import StageActions from '../events/StageActions';

function getActionMixin(stageID) {
  return {
    beginStage: StageActions.beginStage.bind(null, stageID),

    fetchLogs: StageActions.fetchLogs.bind(null, stageID),

    fetchStageStatus: StageActions.fetchStageStatus.bind(null, stageID),

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

      return this.get('errorCount') > 0;
    }
  };
}

module.exports = getActionMixin;
