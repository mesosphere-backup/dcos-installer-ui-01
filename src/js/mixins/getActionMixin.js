import StageActions from '../events/StageActions';

function getActionMixin(stageID) {
  return {
    beginStage: StageActions.beginStage.bind(null, stageID),

    fetchLogs: StageActions.fetchLogs.bind(null, stageID),

    fetchStageStatus: StageActions.fetchStageStatus.bind(null, stageID),

    getInitialState: function () {
      return {
        agents: {
          completed: false,
          errors: 0,
          totalRunning: 0,
          totalStarted: 0,
          totalAgents: 0
        },
        errorDetails: [],
        masters: {
          completed: false,
          errors: 0,
          totalRunning: 0,
          totalStarted: 0,
          totalMasters: 0
        }
      };
    },

    isCompleted: function () {
      return this.isMasterCompleted() && this.isAgentCompleted();
    },

    isFailed: function () {
      let data = this.getSet_data || {};

      if (Object.keys(data).length === 0) {
        return false;
      }

      return data.masters.errors > 0;
    },

    isMasterCompleted: function () {
      let data = this.getSet_data || {};

      if (Object.keys(data).length === 0) {
        return false;
      }

      return data.masters.completed && data.masters.totalMasters > 0
        && data.masters.totalStarted === data.masters.totalMasters;
    },

    isAgentCompleted: function () {
      let data = this.getSet_data || {};

      if (Object.keys(data).length === 0) {
        return false;
      }

      return data.agents.completed && data.agents.totalAgents > 0
        && data.agents.totalStarted === data.agents.totalAgents;
    }
  };
}

module.exports = getActionMixin;
