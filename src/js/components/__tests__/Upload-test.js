jest.dontMock('../Upload');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');

var Upload = require('../Upload');

function getInstance(props, container) {
  return ReactDOM.render(
    <Upload {...props} />, container
  );
}

describe('Upload', function () {
  beforeEach(function () {
    this.prevFileReader = global.FileReader;
    global.FileReader = class FileReader {
      readAsText() {
        this.onload({target: {result: 'file text'}});
      }
    }
    this.container = document.createElement('div');
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#handleUploadFinish', function () {
    it('should be called after uploading is finished', function () {
      var instance = getInstance({}, this.container);
      instance.handleUploadFinish = jasmine.createSpy();
      instance.uploadFile('hello');

      expect(instance.handleUploadFinish).toHaveBeenCalled();
    });
  });

  describe('props#onUploadFinish', function () {
    it('should be called after uploading is finished', function () {
      var spy = jasmine.createSpy();
      var instance = getInstance({onUploadFinish: spy}, this.container);
      instance.uploadFile('hello');

      expect(spy).toHaveBeenCalled();
    });
  });
});
