const MONCOMPTEPRO_HOST =
  Cypress.env('MONCOMPTEPRO_HOST') || 'http://localhost:3000';

describe('join organizations', () => {
  before(() => {
    cy.mailslurp().then(mailslurp =>
      mailslurp.inboxController.deleteAllInboxEmails({
        inboxId: '233fd508-224d-4fe7-88ed-0a0d1df10e07',
      })
    );
    cy.mailslurp().then(mailslurp =>
      mailslurp.inboxController.deleteAllInboxEmails({
        inboxId: 'ba97e7a6-e603-465e-b2a5-236489ee0bb2',
      })
    );
  });

  it('join organisation via sponsorship', function() {
    cy.login(
      '233fd508-224d-4fe7-88ed-0a0d1df10e07@mailslurp.com',
      'password123'
    );

    cy.visit(`${MONCOMPTEPRO_HOST}/users/join-organization`);

    // Click on the suggested organization
    cy.get('.fr-grid-row .fr-col-12:first-child .fr-tile__link').click();

    // Open member selection
    cy.get('.choices').click();

    // Internal members should be available for selection
    cy.get('.choices__list').contains('Jean Sponsor1 - Sbire');
    cy.get('.choices__list').contains('Jean Sponsor2 - Sbire');

    // Current user should not be available for selection

    // External member should not be available for selection
    cy.get('.choices__list')
      .contains('Jean External1 - Sbire')
      .should('not.exist');

    // Member that has not been authenticated yet should not be seen
    cy.get('.choices__list')
      .contains('Jean NotAuthenticated1 - Sbire')
      .should('not.exist');

    // Member that has not been authenticated yet should not be seen
    cy.get('.choices__list')
      .contains('Jean NeedsOfficialContactEmailVerification1 - Sbire')
      .should('not.exist');

    // Select second member
    cy.get('[name="search_terms"]').type('Sponsor2{enter}');

    cy.get('[type="submit"]').click();

    cy.contains('Votre compte est créé');
    cy.contains('Jean Sponsor2 a été informé');
  });

  it('should send mail to sponsor', function() {
    cy.mailslurp()
      // use inbox id and a timeout of 30 seconds
      .then(mailslurp =>
        mailslurp.waitForLatestEmail(
          'ba97e7a6-e603-465e-b2a5-236489ee0bb2',
          60000,
          true
        )
      )
      // assert reception of notification email
      .then(email => {
        expect(email.body).to.match(
          /.*Jean Nouveau.*\(233fd508-224d-4fe7-88ed-0a0d1df10e07@mailslurp.com\).*a rejoint l’organisation.*Direction interministerielle du numerique \(DINUM\).*sur .*MonComptePro/
        );
      });
  });
});
