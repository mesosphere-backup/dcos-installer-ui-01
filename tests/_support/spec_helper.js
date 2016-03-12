function getCurrentPageFixture(page) {
  if (page == null) {
    page = 'null';
  }

  return 'fx:current-page/' + page;
}

function getStageActionRegex(page) {
  var str = '/action/' + page.replace(/-/g, '');
  return new RegExp(str);
}

Cypress.addParentCommand('configureCluster', function (configuration) {
  if (Object.keys(configuration).length === 0) {
    return;
  }

  cy.chain().server();

  var pageToTest = configuration.pageToTest;
  var fixturePath = getCurrentPageFixture(pageToTest);
  cy.route(/action\/current/, fixturePath);

  if (pageToTest && configuration.stageStatus) {
    var stageActionRegex = getStageActionRegex(pageToTest);
    cy.route(
      stageActionRegex, 'fx:stage-state-json/' + configuration.stageStatus
    );
  }

  if (configuration.success) {
    cy.route(/success/, 'fx:config/success.json');
  }

  cy.route(/configure\/type/, 'fx:config/config-type.json');

  if (configuration.erroredForm) {
    cy.route({
      url: /configure\/status/,
      response: 'fx:config/config-status.json',
      status: 500
    });
  }

  if (configuration.passForm) {
    cy.route({
      url: /configure/,
      response: '',
      method: 'POST',
      status: 200
    });
  }

  cy.route(/configure$/, 'fx:config/config.json');
});

Cypress.addParentCommand('visitUrl', function (options) {
  var callback = function () {};
  var url = 'http://localhost:4200/#' + options.url;

  cy.visit(url, {onBeforeLoad: callback});
});
