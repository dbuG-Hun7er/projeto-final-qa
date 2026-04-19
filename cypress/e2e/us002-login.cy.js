import { login, assertLoginError } from "../support/actions/login.actions";

describe("US002 - Login na plataforma", () => {
  beforeEach(() => {
    cy.visitStore();
    cy.fixture("users").as("users");
  });

  it("CT-US002-01: deve logar com usuário ativo (caminho feliz)", function () {
    login(this.users.validUser.email, this.users.validUser.password);

    // Ajuste conforme o comportamento real do site
    cy.url().should("not.contain", "minha-conta");
    cy.contains("Minha conta").should("be.visible");
  });

  it("CT-US002-02: deve exibir erro com senha inválida", function () {
    login(this.users.invalidUser.email, this.users.invalidUser.password);
    assertLoginError();
  });
});