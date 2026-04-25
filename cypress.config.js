const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://lojaebac.ebaconline.art.br",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
});
