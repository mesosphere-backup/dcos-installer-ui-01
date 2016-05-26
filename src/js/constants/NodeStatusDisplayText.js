import NodeStatuses from './NodeStatuses';

module.exports = {
  [NodeStatuses.FAILED]: 'Failed',
  [NodeStatuses.RUNNING]: 'Running',
  [NodeStatuses.SUCCESS]: 'Success',
  [NodeStatuses.TERMINATED]: 'Terminated',
  [NodeStatuses.UNSTARTED]: 'Pending'
};
