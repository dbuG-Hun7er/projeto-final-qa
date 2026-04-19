import { LoginPage } from "../pages/login.page";

export const login = (email, password) => {
  cy.visit("/minha-conta");
  cy.get(LoginPage.email).clear().type(email);
  cy.get(LoginPage.password).clear().type(password, { log: false });
  cy.get(LoginPage.submit).click();
};

export const assertLoginError = () => {
  cy.get(LoginPage.errorAlert).should("be.visible");
};