jest.dontMock('../StageLinks');
jest.dontMock('../icons/IconDownload');
jest.dontMock('../icons/IconEdit');
jest.dontMock('../../stores/InstallerStore');
jest.dontMock('../../utils/ProcessStageUtil');
jest.dontMock('../../events/StageActions');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../config/Config');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');

var StageLinks = require('../StageLinks');

function getInstance(props, container) {
  return ReactDOM.render(
    <StageLinks {...props} />, container
  );
}

describe('StageLinks', function () {
  beforeEach(function () {
    this.container = document.createElement('div');
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#getDownloadLink', function () {
    it('gets called if display is disabled', function () {
      var instance = getInstance({disabledDisplay: true}, this.container);

      instance.getDownloadLink = jasmine.createSpy();
      instance.render();

      expect(instance.getDownloadLink).toHaveBeenCalled();
    });

    it('gets called if there are no errors and stage is completed', function () {
      var instance = getInstance(
        {completed: true, totalErrors: 0},
        this.container
      );

      instance.getDownloadLink = jasmine.createSpy();
      instance.render();

      expect(instance.getDownloadLink).toHaveBeenCalled();
    });

    it('gets called if there are errors and stage is completed', function () {
      var instance = getInstance(
        {completed: true, totalErrors: 1},
        this.container
      );

      instance.getDownloadLink = jasmine.createSpy();
      instance.render();

      expect(instance.getDownloadLink).toHaveBeenCalled();
    });
  });

  describe('#getEditSetupLink', function () {
    it('gets called if there are errors and stage is completed', function () {
      var instance = getInstance(
        {completed: true, totalErrors: 1},
        this.container
      );

      instance.getEditSetupLink = jasmine.createSpy();
      instance.render();

      expect(instance.getEditSetupLink).toHaveBeenCalled();
    });

    it('gets called if failed', function () {
      var instance = getInstance(
        {failed: true, totalErrors: 1},
        this.container
      );

      instance.getEditSetupLink = jasmine.createSpy();
      instance.render();

      expect(instance.getEditSetupLink).toHaveBeenCalled();
    });
  });
});
