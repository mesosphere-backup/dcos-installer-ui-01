jest.dontMock('../APIErrorModal');
jest.dontMock('../ErrorLabel');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../stores/PreFlightStore');
jest.dontMock('../../stores/DeployStore');
jest.dontMock('../../stores/PostFlightStore');
jest.dontMock('../../mixins/getActionMixin');
jest.dontMock('../icons/IconDownload');
jest.dontMock('../../constants/StoreMap');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ErrorLabel = require('../ErrorLabel');
var PostFlightStore = require('../../stores/PostFlightStore');

describe('ErrorLabel', function () {
  beforeEach(function () {
    this.container = document.createElement('div');
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#getErrorLabel', function () {
    beforeEach(function () {
      this.errors = []
      this.previousGet = PostFlightStore.get;
      PostFlightStore.get = function () {
        return this.errors;
      }.bind(this);
    });

    afterEach(function () {
      PostFlightStore.get = this.previousGet;
    });

    it('should say \'No Errors Found\' if no errors are found', function () {
      this.errors = [];
      var instance = ReactDOM.render(
        <ErrorLabel errors={[]} />,
        this.container
      );

      var result = ReactDOM.findDOMNode(
        instance
      ).querySelector('span');

      expect(result.textContent.indexOf('No Errors Found') > -1)
        .toEqual(true);
    });

    it('should alert number of errors if there are errors', function () {
      this.errors = [
        {message: 'BOOM', host: 'SKI'},
        {message: 'BOOM', host: 'SKI'},
        {message: 'BOOM', host: 'SKI'},
        {message: 'BOOM', host: 'SKI'}
      ];

      var instance = ReactDOM.render(
        <ErrorLabel errors={this.errors} />,
        this.container
      );

      var result = ReactDOM.findDOMNode(
        instance
      ).querySelector('.error-label');

      expect(result.textContent.indexOf('4 Errors') > -1).toEqual(true);
    });
  });

});
