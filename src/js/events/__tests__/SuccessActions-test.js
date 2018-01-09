jest.dontMock('../SuccessActions');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
var Config = require('../../config/Config');
var RequestUtil = require('mesosphere-shared-reactjs').RequestUtil;
var SuccessActions = require('../SuccessActions');

describe('SuccessActions', function () {

  describe('#fetchDCOSURL', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      SuccessActions.fetchDCOSURL();
      this.configuration = RequestUtil.json.calls.allArgs()[0][0];
    });

    afterEach(function () {
      RequestUtil.json = this.previousJSON;
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}success`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.DCOS_UI_URL_CHANGE);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.DCOS_UI_URL_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

});
