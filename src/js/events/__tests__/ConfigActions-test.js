jest.dontMock('../ConfigActions');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
var Config = require('../../config/Config');
var ConfigActions = require('../ConfigActions');
var RequestUtil = require('mesosphere-shared-reactjs').RequestUtil;

describe('ConfigActions', function () {

  describe('#fetchConfig', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      ConfigActions.fetchConfig();
      this.configuration = RequestUtil.json.calls[0].args[0];
    });

    afterEach(function () {
      RequestUtil.json = this.previousJSON;
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}configure`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_CHANGE_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_CHANGE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#fetchConfigState', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      ConfigActions.fetchConfigState();
      this.configuration = RequestUtil.json.calls[0].args[0];
    });

    afterEach(function () {
      RequestUtil.json = this.previousJSON;
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}configure/status`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_STATUS_CHANGE_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_STATUS_CHANGE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#fetchConfigType', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      ConfigActions.fetchConfigType();
      this.configuration = RequestUtil.json.calls[0].args[0];
    });

    afterEach(function () {
      RequestUtil.json = this.previousJSON;
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}configure/type`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_TYPE_CHANGE_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_TYPE_CHANGE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#updateConfig', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      ConfigActions.updateConfig();
      this.configuration = RequestUtil.json.calls[0].args[0];
    });

    afterEach(function () {
      RequestUtil.json = this.previousJSON;
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}configure`);
    });

    it('makes a POST request', function () {
      expect(this.configuration.method).toEqual('post');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_UPDATE_FIELD_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CONFIGURE_UPDATE_FIELD_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

});
