jest.autoMockOff();
jest.dontMock('../PreFlightStore');

var PreFlightStore = require('../PreFlightStore');
var EventTypes = require('../../constants/EventTypes');
var ProcessStageUtil = require('../../utils/ProcessStageUtil');

describe('PreFlightStore', function () {
  describe('#processUpdateSuccess', function () {
    beforeEach(function () {
      this.processState = ProcessStageUtil.processState;
      this.previousEmit = PreFlightStore.emit;

      ProcessStageUtil.processState = function () {
        return {}
      };

      PreFlightStore.emit = jasmine.createSpy();
      PreFlightStore.processUpdateSuccess({});
    });

    afterEach(function () {
      ProcessStageUtil.processState = this.processState;
      PreFlightStore.emit = this.previousEmit;
    });

    it('emits correct event type', function () {
      expect(PreFlightStore.emit.calls[0].args[0]).toEqual(
        EventTypes.PREFLIGHT_STATE_CHANGE
      );
    });

    it('emits state finish if stage is completed', function () {
      let previousIsCompleted = PreFlightStore.isCompleted;
      PreFlightStore.isCompleted = function () {
        return true;
      };
      PreFlightStore.emit = jasmine.createSpy();
      PreFlightStore.processUpdateSuccess({});

      expect(PreFlightStore.emit.calls[1].args[0]).toEqual(
        EventTypes.PREFLIGHT_STATE_FINISH
      );

      PreFlightStore.isCompleted = previousIsCompleted;
    });
  });
});
