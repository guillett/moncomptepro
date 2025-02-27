// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import 'cypress-mailslurp';

const MONCOMPTEPRO_HOST =
  Cypress.env('MONCOMPTEPRO_HOST') || 'http://localhost:3000';

Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    // Visit the signup page
    cy.visit(`${MONCOMPTEPRO_HOST}/users/start-sign-in`);

    // Sign in with the existing inbox
    cy.get('[name="login"]').type(email);
    cy.get('[type="submit"]').click();

    cy.get('[name="password"]').type(password);
    cy.get('[action="/users/sign-in"]  [type="submit"]')
      .contains('Se connecter')
      .click();
  });
});
