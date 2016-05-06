jest.dontMock('../APIErrorModal');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../icons/IconDownload');
jest.dontMock('../../constants/StoreMap');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var APIErrorModal = require('../APIErrorModal');
var PostFlightStore = require('../../stores/PostFlightStore');

describe('APIErrorModal', function () {
  beforeEach(function () {
    this.container = document.createElement('div');

    this.errors = [
      {message: 'error message', host: '10.2.516.21'},
      {message: 'error message', host: '10.2.516.21'},
      {message: 'error message', host: '10.2.516.21'},
      {message: 'error message', host: '10.2.516.21'}
    ]
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  it('should render one container per error', function () {
    this.instance = ReactDOM.render(
      <APIErrorModal open={true} errors={this.errors} />,
      this.container
    );

    this.instance.getMessage = jasmine.createSpy();
    this.instance.getContent();

    expect(this.instance.getMessage.calls.length).toEqual(this.errors.length);
  });

  describe('#handleDownloadLogs', function () {
    it('should call fetchLogs for the correct store', function () {
      var previousFetch = PostFlightStore.fetchLogs;
      PostFlightStore.fetchLogs = jasmine.createSpy();

      this.instance = ReactDOM.render(
        <APIErrorModal open={true} errors={this.errors} step="postflight" />,
        this.container
      );

      ReactTestUtils.Simulate.click(
        ReactDOM.findDOMNode(
          ReactDOM.render(
            this.instance.getFooter(),
            this.container
          )
        ).querySelector('.button')
      );

      expect(PostFlightStore.fetchLogs).toHaveBeenCalled();

      PostFlightStore.fetchLogs = previousFetch;
    });
  });
});
