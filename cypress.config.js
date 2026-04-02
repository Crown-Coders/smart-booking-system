// /workspaces/smart-booking-system/cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Project settings
  projectId: "smart-booking-system",
  
  // Timeouts
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 60000,
  
  // Viewport settings
  viewportWidth: 1280,
  viewportHeight: 720,
  
  // Video settings
  video: true,
  videoCompression: 32,
  videoUploadOnPasses: false,
  
  // Screenshot settings
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/screenshots",
  
  // Reporter settings
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    timestamp: "mmddyyyy_HHMMss"
  },
  
  // Environment variables
  env: {
    apiUrl: 'http://localhost:5000',
    coverage: true,
  },
  
  // E2E specific configuration
  e2e: {
    // Base URL for the app
    baseUrl: 'http://localhost:5173',
    
    // File paths
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    
    // Folders
    downloadsFolder: 'cypress/downloads',
    fixturesFolder: 'cypress/fixtures',
    
    // Test isolation
    testIsolation: true,
    
    // Experimental features
    experimentalMemoryManagement: true,
    experimentalRunAllSpecs: true,
    
    // Setup Node events
    setupNodeEvents(on, config) {
      // Handle uncaught exceptions
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });

      // Add coverage support
      on('after:run', (results) => {
        if (config.env.coverage) {
          // Generate coverage report
          const coverage = require('@cypress/code-coverage/task');
          coverage(on, config);
        }
      });

      // Modify config based on environment
      if (config.env.API_URL) {
        config.env.apiUrl = config.env.API_URL;
      }

      return config;
    },
  },
  
  // Chrome-specific settings
  chromeWebSecurity: false,
  
  // Retry settings
  retries: {
    runMode: 2,
    openMode: 0
  },
  
  // Block hosts (useful for blocking analytics in tests)
  blockHosts: [
    '*.google-analytics.com',
    '*.googletagmanager.com'
  ],
  
  // Exclude specs from watching
  excludeSpecPattern: [
    '*.hot-update.js',
    '*.json'
  ],
  
  // Number of tests to run in parallel
  numTestsKeptInMemory: 50,
  
  // Browser settings
  browsers: [
    {
      name: 'chrome',
      family: 'chromium',
      channel: 'stable',
      displayName: 'Chrome',
      version: 'latest'
    },
    {
      name: 'firefox',
      family: 'firefox',
      channel: 'stable',
      displayName: 'Firefox',
      version: 'latest'
    },
    {
      name: 'edge',
      family: 'chromium',
      channel: 'stable',
      displayName: 'Edge',
      version: 'latest'
    }
  ]
});