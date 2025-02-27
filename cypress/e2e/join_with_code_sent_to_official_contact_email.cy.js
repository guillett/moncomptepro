const MONCOMPTEPRO_HOST =
  Cypress.env('MONCOMPTEPRO_HOST') || 'http://localhost:3000';

describe('join organizations', () => {
  before(() => {
    cy.mailslurp().then(mailslurp =>
      mailslurp.inboxController.deleteAllInboxEmails({
        inboxId: '26ccc0fa-0dc3-4f12-9335-7bb00282920c',
      })
    );
    cy.mailslurp().then(mailslurp =>
      mailslurp.inboxController.deleteAllInboxEmails({
        inboxId: 'c348a2c3-bf54-4f15-bb12-a2d7047c832f',
      })
    );
  });

  it('join collectivité territoriale with code send to official contact email', function() {
    cy.login(
      'c348a2c3-bf54-4f15-bb12-a2d7047c832f@mailslurp.com',
      'password123'
    );

    cy.visit(`${MONCOMPTEPRO_HOST}/users/join-organization`);
    cy.get('[name="siret"]').type('21340126800130');
    cy.get('[type="submit"]').click();

    // Check that the website is waiting for the user to verify their email
    cy.get('#email-badge-lowercase').contains(
      '26ccc0fa-0dc3-4f12-9335-7bb00282920c@mailslurp.com'
    );

    // Verify the email with the code received by email
    cy.mailslurp()
      // use inbox id and a timeout of 30 seconds
      .then(mailslurp =>
        mailslurp.waitForLatestEmail(
          '26ccc0fa-0dc3-4f12-9335-7bb00282920c',
          60000,
          true
        )
      )
      // extract the verification code from the email subject
      .then(email => {
        const matches = /.*<a style="text-decoration:none; color:#000091; font-weight:normal;" target="_blank"><strong>([a-z]{2,25}-[a-z]{2,25})<\/strong><\/a>.*/.exec(
          email.body
        );
        if (matches && matches.length > 0) {
          return matches[1];
        }
        throw new Error('Could not find verification code in received email');
      })
      // fill out the verification form and submit
      .then(code => {
        cy.get('[name="official_contact_email_verification_token"]').type(code);
        cy.get('[type="submit"]').click();
      });

    cy.contains('Votre compte est créé');
  });
});
