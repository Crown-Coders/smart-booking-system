// /workspaces/smart-booking-system/cypress/e2e/chatbot.cy.js
describe('Chatbot E2E Tests', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('http://localhost:5173/login');
    
    // Login with test credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
    
    // Wait for any loading states to finish
    cy.get('.loading-spinner').should('not.exist');
  });

  describe('Chatbot UI Interactions', () => {
    it('should open and close chatbot', () => {
      // Verify chatbot is initially closed
      cy.get('.chat-container').should('not.exist');
      
      // Click chatbot button to open
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Chat should be visible
      cy.get('.chat-container').should('be.visible');
      cy.get('.chat-header').should('contain', 'Care Assistant');
      cy.get('.chat-header p').should('contain', 'AI-powered guide');
      
      // Close chat
      cy.get('.chat-close-btn').click();
      cy.get('.chat-container').should('not.exist');
    });

    it('should display initial bot message', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Check initial bot message
      cy.get('.message.bot').first().should('contain', 'Hello! I am the Mental.com Care Assistant');
      cy.get('.message.bot').first().should('contain', 'AI, not a human therapist');
    });

    it('should send message via input and receive response', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Type and send message
      cy.get('.chat-input-area input').type('Hello, I need help{enter}');
      
      // User message should appear
      cy.get('.message.user').last().should('contain', 'Hello, I need help');
      
      // Bot should show typing indicator
      cy.get('.typing-indicator').should('be.visible');
      
      // Bot should respond
      cy.get('.message.bot', { timeout: 10000 }).should('have.length.at.least', 2);
      cy.get('.typing-indicator').should('not.exist');
    });

    it('should use suggestion chips', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Click each suggestion chip and verify they work
      const suggestions = [
        'Find a therapist',
        'Quick grounding exercise',
        'What are your prices?',
        'Do you take insurance?'
      ];
      
      suggestions.forEach(suggestion => {
        cy.contains('.suggestion-chip', suggestion).click();
        cy.get('.message.user').last().should('contain', suggestion);
        cy.get('.typing-indicator').should('be.visible');
        cy.get('.message.bot', { timeout: 10000 }).should('have.length.at.least', 2);
      });
    });

    it('should disable input while bot is typing', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Send message
      cy.get('.chat-input-area input').type('Test message{enter}');
      
      // Input and send button should be disabled while typing
      cy.get('.chat-input-area input').should('be.disabled');
      cy.get('.chat-input-area button[type="submit"]').should('be.disabled');
      
      // Wait for response and check they become enabled
      cy.get('.message.bot', { timeout: 10000 }).should('have.length.at.least', 2);
      cy.get('.chat-input-area input').should('be.enabled');
      cy.get('.chat-input-area button[type="submit"]').should('be.enabled');
    });
  });

  describe('Chatbot Functionality', () => {
    it('should maintain conversation history', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Send first message
      cy.get('.chat-input-area input').type('First message{enter}');
      cy.get('.message.user').first().should('contain', 'First message');
      
      // Wait for first response
      cy.get('.message.bot', { timeout: 10000 }).should('have.length.at.least', 2);
      
      // Send second message
      cy.get('.chat-input-area input').type('Second message{enter}');
      cy.get('.message.user').last().should('contain', 'Second message');
      
      // Should have multiple messages (initial + user1 + bot1 + user2 + bot2)
      cy.get('.message').should('have.length.at.least', 5);
    });

    it('should handle therapist search flow', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Ask for therapist
      cy.get('.chat-input-area input').type('Find me a CBT therapist{enter}');
      
      // Wait for response with therapist info
      cy.get('.message.bot', { timeout: 15000 }).should('contain', 'therapist');
    });

    it('should handle empty message submission', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Try to send empty message
      cy.get('.chat-input-area button[type="submit"]').click();
      
      // No user message should be added
      cy.get('.message.user').should('have.length', 1); // Only initial bot message
      
      // Try to send message with only spaces
      cy.get('.chat-input-area input').type('   ');
      cy.get('.chat-input-area button[type="submit"]').should('be.disabled');
    });
  });

  describe('Chatbot Responsiveness', () => {
    it('should scroll to bottom when new messages arrive', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Send multiple messages to trigger scrolling
      for (let i = 0; i < 3; i++) {
        cy.get('.chat-input-area input').type(`Message ${i}{enter}`);
        cy.wait(500); // Small wait between messages
      }
      
      // Check that scroll position is near bottom
      cy.get('.chat-messages').then($el => {
        const scrollBottom = $el.scrollTop() + $el.innerHeight();
        const scrollHeight = $el[0].scrollHeight;
        expect(scrollBottom).to.be.closeTo(scrollHeight, 50);
      });
    });

    it('should handle long messages properly', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      const longMessage = 'This is a very long message that should still be handled properly by the chat interface without breaking the layout or causing any visual issues. '.repeat(5);
      
      cy.get('.chat-input-area input').type(longMessage + '{enter}');
      cy.get('.message.user').last().should('contain', longMessage.substring(0, 50));
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Intercept and mock network error
      cy.intercept('POST', '**/api/chatbot', {
        forceNetworkError: true
      }).as('chatError');
      
      cy.get('.chat-input-area input').type('Test message{enter}');
      
      // Should show error message
      cy.get('.message.bot', { timeout: 10000 }).last()
        .should('contain', 'Sorry, I’m currently offline');
    });

    it('should handle API errors gracefully', () => {
      cy.get('button[aria-label*="AI Assistant"]').click();
      
      // Intercept and mock 500 error
      cy.intercept('POST', '**/api/chatbot', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('chatError');
      
      cy.get('.chat-input-area input').type('Test message{enter}');
      
      // Should show error message
      cy.get('.message.bot', { timeout: 10000 }).last()
        .should('contain', 'Sorry, I’m currently offline');
    });
  });
});