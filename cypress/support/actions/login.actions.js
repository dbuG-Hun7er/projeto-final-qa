import { LoginPage } from "../pages/login.page";

export const login = (email, password) => {
  cy.visit("/minha-conta");
  cy.intercept("POST", "**/minha-conta/**").as("loginRequest");

  cy.get(LoginPage.email).first().clear().type(email);
  cy.get(LoginPage.password).first().clear().type(password, { log: false });
  cy.get(LoginPage.submit).first().click();

  cy.wait("@loginRequest");
};

export const assertLoginSuccess = () => {
  cy.url().should("include", "/minha-conta");
  cy.get(LoginPage.accountTitle).should("be.visible");
};

export const assertLoginError = () => {
  cy.get(LoginPage.errorAlert).should("be.visible");
};
