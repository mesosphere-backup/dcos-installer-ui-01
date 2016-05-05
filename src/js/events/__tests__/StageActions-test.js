jest.autoMockOff();

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
var Config = require('../../config/Config');
var RequestUtil = require('mesosphere-shared-reactjs').RequestUtil;
var StageActions = require('../StageActions');

describe('StageActions', function () {

  describe('#fetchStageStatus', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      StageActions.fetchStageStatus('preflight');
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
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}action/preflight`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.PREFLIGHT_UPDATE_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.PREFLIGHT_UPDATE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#beginStage', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      StageActions.beginStage('preflight');
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
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}action/preflight`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.PREFLIGHT_BEGIN_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.PREFLIGHT_BEGIN_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#fetchLogs', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      StageActions.fetchLogs('preflight');
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
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}action/preflight/logs`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.PREFLIGHT_LOGS_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.PREFLIGHT_LOGS_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#fetchCurrentStage', function () {

    beforeEach(function () {
      this.previousJSON = RequestUtil.json;
      RequestUtil.json = jasmine.createSpy();
      StageActions.fetchCurrentStage();
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
        .toEqual(`${Config.rootUrl}${Config.apiPrefix}action/current`);
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CURRENT_STAGE_CHANGE_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.CURRENT_STAGE_CHANGE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

});
