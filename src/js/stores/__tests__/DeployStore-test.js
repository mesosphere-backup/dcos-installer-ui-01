jest.dontMock('../DeployStore');

var DeployStore = require('../DeployStore');
var EventTypes = require('../../constants/EventTypes');
var ProcessStageUtil = require('../../utils/ProcessStageUtil');

describe('DeployStore', function () {
  describe('#processUpdateSuccess', function () {
    beforeEach(function () {
      this.processState = ProcessStageUtil.processState;
      this.previousEmit = DeployStore.emit;

      ProcessStageUtil.processState = function () {
        return {}
      };

      DeployStore.emit = jasmine.createSpy();
      DeployStore.processUpdateSuccess({});
    });

    afterEach(function () {
      ProcessStageUtil.processState = this.processState;
      DeployStore.emit = this.previousEmit;
    });

    it('emits correct event type', function () {
      expect(DeployStore.emit.calls.allArgs()[0][0]).toEqual(
        EventTypes.DEPLOY_STATE_CHANGE
      );
      expect(DeployStore.emit.calls.allArgs()[0][1]).toEqual({});
    });

    it('emits state finish if stage is completed', function () {
      let previousIsCompleted = DeployStore.isCompleted;
      DeployStore.isCompleted = function () {
        return true;
      };
      DeployStore.emit = jasmine.createSpy();
      DeployStore.processUpdateSuccess({});

      expect(DeployStore.emit.calls.allArgs()[1][0]).toEqual(
        EventTypes.POSTFLIGHT_STATE_FINISH
      );

      DeployStore.isCompleted = previousIsCompleted;
    });
  });
});
