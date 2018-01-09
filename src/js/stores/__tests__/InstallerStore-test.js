jest.dontMock('../InstallerStore');

var InstallerStore = require('../InstallerStore');
var EventTypes = require('../../constants/EventTypes');

describe('InstallerStore', function () {
  describe('#processCurrentStage', function () {
    beforeEach(function () {
      this.previousEmit = InstallerStore.emit;

      InstallerStore.emit = jasmine.createSpy();
      InstallerStore.processCurrentStage('preflight');
    });

    afterEach(function () {
      InstallerStore.emit = this.previousEmit;
    });

    it('emits correct event type', function () {
      expect(InstallerStore.emit.calls.allArgs()[0][0]).toEqual(
        EventTypes.CURRENT_STAGE_CHANGE
      );
      expect(InstallerStore.emit.calls.allArgs()[0][1]).toEqual('preflight');
    });
  });

  describe('#setInstallInProgress', function () {
    beforeEach(function () {
      this.previousEmit = InstallerStore.emit;

      InstallerStore.emit = jasmine.createSpy();
      InstallerStore.setInstallInProgress(true);
    });

    afterEach(function () {
      InstallerStore.emit = this.previousEmit;
    });

    it('emits correct event type', function () {
      expect(InstallerStore.emit.calls.allArgs()[0][0]).toEqual(
        EventTypes.GLOBAL_INSTALL_IN_PROGRESS_CHANGE
      );
    });
  });
});
