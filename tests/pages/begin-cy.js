describe('Begin Page', function () {
  beforeEach(function () {
    cy.configureCluster({
      pageToTest: null
    });
    cy.visitUrl({url: ''});
  });

  it('should be \'Begin Installation\'', function () {
    cy.get('.button span').contains('Begin Installation');
  });

  it('should go to setup if clicked', function () {
    cy.get('.button span').click();
    cy.hash().should('eq', '#/setup');
  });
});

describe('Resume Page', function () {
  beforeEach(function () {
    cy.configureCluster({
      pageToTest: 'pre-flight'
    });
    cy.visitUrl({url: ''});
  });

  context('Resume installation button', function () {
    it('should be \'Resume Installation\'', function () {
      cy.get('.button span').contains('Resume Installation');
    });

    it('should go to pre flight if resumed', function () {
      cy.get('.button span').click();
      cy.hash().should('eq', '#/pre-flight');
    });
  });

  context('Begin new installation link', function () {
    it('should have link to begin new installation', function () {
      cy.get('.stage-link').contains('Begin New Installation');
    });

    it('should begin a new installation if clicked', function () {
      cy.get('.stage-link').click();
      cy.hash().should('eq', '#/setup');
    });
  });
});
