jest.dontMock('../PostFlightStore');

var PostFlightStore = require('../PostFlightStore');
var EventTypes = require('../../constants/EventTypes');
var ProcessStageUtil = require('../../utils/ProcessStageUtil');

describe('PostFlightStore', function () {
  describe('#processUpdateSuccess', function () {
    beforeEach(function () {
      this.processState = ProcessStageUtil.processState;
      this.previousEmit = PostFlightStore.emit;

      ProcessStageUtil.processState = function () {
        return {}
      };

      PostFlightStore.emit = jasmine.createSpy();
      PostFlightStore.processUpdateSuccess({});
    });

    afterEach(function () {
      ProcessStageUtil.processState = this.processState;
      PostFlightStore.emit = this.previousEmit;
    });

    it('emits correct event type', function () {
      expect(PostFlightStore.emit.calls.allArgs()[0][0]).toEqual(
        EventTypes.POSTFLIGHT_STATE_CHANGE
      );
    });

    it('emits state finish if stage is completed', function () {
      let previousIsCompleted = PostFlightStore.isCompleted;
      PostFlightStore.isCompleted = function () {
        return true;
      };
      PostFlightStore.emit = jasmine.createSpy();
      PostFlightStore.processUpdateSuccess({});

      expect(PostFlightStore.emit.calls.allArgs()[1][0]).toEqual(
        EventTypes.POSTFLIGHT_STATE_FINISH
      );

      PostFlightStore.isCompleted = previousIsCompleted;
    });
  });
});
