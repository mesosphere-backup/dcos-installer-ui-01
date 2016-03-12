describe.only('Setup', function () {
  context('default values', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: null,
        erroredForm: true
      });
      cy.visitUrl({url: '/setup'});
    });

    it('should have the default value for master list', function () {
      cy.get('textarea[name="master_list"]').contains('default master list');
    });

    it('should have the default value for agent list', function () {
      cy.get('textarea[name="agent_list"]').contains('default agent list');
    });

    it('should have the default value for ssh user', function () {
      cy.get('input[name="ssh_user"]').should('have.value', 'default ssh user');
    });

    it('should have the default value for ssh key', function () {
      cy.get('textarea[name="ssh_key"]').contains('default ssh key');
    });

    it('should have the default value for username', function () {
      cy.get('input[name="superuser_username"]')
        .should('have.value', 'default username');
    });

    it('should have the default value for resolvers', function () {
      cy.get('textarea[name="resolvers"]').contains('default resolver');
    });

    it('should have a disabled action button', function () {
      cy.get('.section-action.button.disabled').should('to.have.length', 1);
    });

    it('should have a disabled navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/setup');
    });
  });

  context('default errored', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: null,
        erroredForm: true
      });
      cy.visitUrl({url: '/setup'});
    });

    it('should have the default value for master list', function () {
      cy.get('.form-help-block').contains('default master error');
    });

    it('should have the default value for agent list', function () {
      cy.get('.form-help-block').contains('default agent error');
    });

    it('should have the default value for ssh user', function () {
      cy.get('.form-help-block').contains('default ssh user error');
    });

    it('should have the default value for ssh key', function () {
      cy.get('.form-help-block').contains('default ssh key error');
    });

    it('should have the default value for username', function () {
      cy.get('.form-help-block').contains('default username error');
    });

    it('should have the default value for resolvers', function () {
      cy.get('.form-help-block').contains('default resolver error');
    });

    it('should have a disabled action button', function () {
      cy.get('.section-action.button.disabled').should('to.have.length', 1);
    });

    it('should have a disabled navigation button', function () {
      cy.get('.navigation-item-next').click();
      cy.hash().should('eq', '#/setup');
    });
  });

  context('errored to passing', function () {
    beforeEach(function () {
      cy.configureCluster({
        pageToTest: null,
        erroredForm: true
      });
      cy.visitUrl({url: '/setup'});
      cy.configureCluster({
        erroredForm: false,
        passForm: true
      })
    });

    it('should remove the error for master list', function () {
      cy.get('textarea[name="master_list"]')
        .focus()
        .blur();

      cy.get('textarea[name="master_list"]')
        .parent()
        .find('.form-help-block').should('to.have.length', 0);
    });

    it('should remove the error for agent list', function () {
      cy.get('textarea[name="agent_list"]')
        .focus()
        .blur();

      cy.get('textarea[name="agent_list"]')
        .parent()
        .find('.form-help-block').should('to.have.length', 0);
    });

    it('should remove the error for ssh user', function () {
      cy.get('input[name="ssh_user"]')
        .focus()
        .blur();

      cy.get('input[name="ssh_user"]')
        .parent()
        .find('.form-help-block').should('to.have.length', 0);
    });

    it('should remove the error for ssh key', function () {
      cy.get('textarea[name="ssh_key"]')
        .focus()
        .blur();

      cy.get('textarea[name="ssh_key"]')
        .parent()
        .find('.form-help-block').should('to.have.length', 0);
    });

    it('should remove the error for username', function () {
      cy.get('input[name="superuser_username"]')
        .focus()
        .blur();

      cy.get('input[name="superuser_username"]')
        .parent()
        .find('.form-help-block').should('to.have.length', 0);
    });

    it('should remove the error for resolvers', function () {
      cy.get('textarea[name="resolvers"]')
        .focus()
        .blur();

      cy.get('textarea[name="resolvers"]')
        .parent()
        .find('.form-help-block').should('to.have.length', 0);
    });
  });
});
