// /workspaces/smart-booking-system/cypress/support/commands.js
// Custom command to login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to open chatbot
Cypress.Commands.add('openChatbot', () => {
  cy.get('button[aria-label*="AI Assistant"]').click();
  cy.get('.chat-container').should('be.visible');
});

// Custom command to send message to chatbot
Cypress.Commands.add('sendChatMessage', (message) => {
  cy.get('.chat-input-area input').type(message + '{enter}');
  cy.get('.message.user').last().should('contain', message);
  cy.get('.typing-indicator').should('be.visible');
});

// Custom command to wait for bot response
Cypress.Commands.add('waitForBotResponse', () => {
  cy.get('.message.bot', { timeout: 10000 }).should('have.length.at.least', 2);
  cy.get('.typing-indicator').should('not.exist');
});