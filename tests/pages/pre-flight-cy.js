describe('Pre Flight', function () {
  context('all nodes running', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'pre-flight',
        stageStatus: 'all-running'
      });
      cy.visitUrl({url: '/pre-flight'});
    });

    it('progress bar should say 50%', function () {
      cy.get('.progress-bar-progress').contains('50%');
    });

    it('should have a disabled navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/pre-flight');
    });

    it('should have a disabled action button', function () {
      cy.get('.section-footer button').click({force: true});
      cy.hash().should('eq', '#/pre-flight');
    });

    it('should have a label with \'Checking 2 of 2\'', function () {
      cy.get('.progress-bar-detail').contains('Checking 2 of 2');
    })

    it('should have a label with \'Checking 3 of 3\'', function () {
      cy.get('.progress-bar-detail').contains('Checking 3 of 3');
    })
  });

  context('some running', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'pre-flight',
        stageStatus: 'some-running'
      });
      cy.visitUrl({url: '/pre-flight'});
    });

    it('progress bar should say 75%', function () {
      cy.get('.progress-bar-progress').contains('75%');
    });

    it('progress bar should say 67%', function () {
      cy.get('.progress-bar-progress').contains('67%');
    });

    it('should have a disabled navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/pre-flight');
    });

    it('should have a disabled action button', function () {
      cy.get('.section-footer button').click({force: true});
      cy.hash().should('eq', '#/pre-flight');
    });

    it('should have a label with \'Checking 2 of 2\'', function () {
      cy.get('.progress-bar-detail').contains('Checking 2 of 2');
    })

    it('should have a label with \'Checking 3 of 3\'', function () {
      cy.get('.progress-bar-detail').contains('Checking 3 of 3');
    })
  });

  context('all success', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'pre-flight',
        stageStatus: 'all-success'
      });
      cy.visitUrl({url: '/pre-flight'});
    });

    it('should have an active navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/deploy');
    });

    it('should have an active action button', function () {
      cy.get('.section-footer button').click();
      cy.hash().should('eq', '#/deploy');
    });

    it('progress bar should say 100%', function () {
      cy.get('.progress-bar-progress').contains('100%');
    });

    it('should say how many masters completed', function () {
      cy.get('.progress-bar-label-content').contains('2 Masters Check Complete');
    });

    it('should say how many agents completed', function () {
      cy.get('.progress-bar-label-content').contains('3 Agents Check Complete');
    });
  });

  context('all fail', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'pre-flight',
        stageStatus: 'all-fail'
      });
      cy.visitUrl({url: '/pre-flight'});
    });

    it('should have a disabled navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/pre-flight');
    });

    it('should have a \'Retry\' button', function () {
      cy.get('.section-footer button').contains('Retry');
    });

    it('progress bar should say 100%', function () {
      cy.get('.progress-bar-progress').contains('100%');
    });

    it('should say how many masters errored', function () {
      cy.get('.progress-bar-label-content')
        .contains('Errors with 2 of 2 Masters');
    });

    it('should say how many agents errored', function () {
      cy.get('.progress-bar-label-content')
        .contains('Errors with 3 of 3 Agents');
    });

    context('error modal', function () {
      it('should have a link saying the number of nodes failed', function () {
        cy.get('.error-label').contains('5 Nodes');
      });

      it('should open a modal when clicked', function () {
        cy.get('.error-label').click();
        cy.get('.error-message-container').should('to.have.length', 5);
      });
    });
  });

  context('agent fail', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'pre-flight',
        stageStatus: 'agent-fail'
      });
      cy.visitUrl({url: '/pre-flight'});
    });

    it('should have an active navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/deploy');
    });

    it('should have a \'Retry\' button', function () {
      cy.get('.section-footer button').contains('Retry');
    });

    it('progress bar should say 100%', function () {
      cy.get('.progress-bar-progress').contains('100%');
    });

    it('should have a \'Deploy\' button', function () {
      cy.get('.section-footer button').contains('Deploy').click();
      cy.hash().should('eq', '#/deploy');
    });

    it('should be able to go back to Setup', function () {
      cy.get('.stage-link span').contains('Edit Setup').click();
      cy.hash().should('eq', '#/setup');
    });

    it('should say how many agents errored', function () {
      cy.get('.progress-bar-label-content')
        .contains('Errors with 2 of 3 Agents');
    });

    it('should say how many masters completed', function () {
      cy.get('.progress-bar-label-content').contains('2 Masters Check Complete');
    });

    it('should have a header indicating errors', function () {
      cy.get('.section-header-primary').contains('Completed with Errors');
    });

    context('error modal', function () {
      it('should have a link saying the number of nodes failed', function () {
        cy.get('.error-label').contains('2 Nodes');
      });

      it('should open a modal when clicked', function () {
        cy.get('.error-label').click();
        cy.get('.error-message-container').should('to.have.length', 2);
      });
    });
  });

  context('master fail', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: 'pre-flight',
        stageStatus: 'master-fail'
      });
      cy.visitUrl({url: '/pre-flight'});
    });

    it('should have a disabled navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/pre-flight');
    });

    it('should have a \'Retry\' button', function () {
      cy.get('.section-footer button').contains('Retry');
    });

    it('should be able to go back to Setup', function () {
      cy.get('.stage-link span').contains('Edit Setup').click();
      cy.hash().should('eq', '#/setup');
    });

    it('progress bar should say 100%', function () {
      cy.get('.progress-bar-progress').contains('100%');
    });

    it('should say how many agents completed', function () {
      cy.get('.progress-bar-label-content').contains('3 Agents Check Complete');
    });

    it('should say how many masters errored', function () {
      cy.get('.progress-bar-label-content').contains('Error with 1 of 2 Masters');
    });

    it('should have a header indicating errors', function () {
      cy.get('.section-header-primary').contains('Pre-Flight Failed');
    });

    context('error modal', function () {
      it('should have a link saying the number of nodes failed', function () {
        cy.get('.error-label').contains('1 Node');
      });

      it('should open a modal when clicked', function () {
        cy.get('.error-label').click();
        cy.get('.error-message-container').should('to.have.length', 1);
      });
    });
  });
});
