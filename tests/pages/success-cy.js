describe('Success page', function () {
  context('all success', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'post-flight',
        stageStatus: 'all-success',
        success: true
      });
      cy.visitUrl({url: '/post-flight'});
    });

    it('should automatically go to success page', function () {
      cy.hash().should('eq', '#/success');
    });

    it('should indicate a successful install', function () {
      cy.get('h2').contains('Successfully Installed');
    });

    it('should say how many master nodes were successful', function () {
      cy.get('.successful-nodes strong').contains('2');
    });

    it('should say how many agent nodes were successful', function () {
      cy.get('.successful-nodes strong').contains('3');
    });

    it('should have a login to dcos button', function () {
      cy.get('.section-footer .button').contains('Log In');
    });
  });

  context('agent fail', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'post-flight',
        stageStatus: 'agent-fail'
      });
      cy.visitUrl({url: '/post-flight'});
      cy.get('.navigation-item-next').click();
    });

    it('should be at the success page', function () {
      cy.hash().should('eq', '#/success');
    });

    it('should indicate a successful install', function () {
      cy.get('h2').contains('Successfully Installed');
    });

    it('should say how many master nodes were successful', function () {
      cy.get('.successful-nodes strong').contains('2');
    });

    it('should say how many agent nodes were successful', function () {
      cy.get('.successful-nodes strong').contains('1');
    });

    it('should have a login to dcos button', function () {
      cy.get('.section-footer .button').contains('Log In');
    });
  });
});
