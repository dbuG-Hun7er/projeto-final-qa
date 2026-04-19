import {
  openAnyProductAndAddToCart,
  openCart,
  setQuantity,
  assertNoticeVisible
} from "../support/actions/cart.actions";

describe("US001 - Adicionar item ao carrinho", () => {
  beforeEach(() => {
    cy.visitStore();
  });

  it("CT-US001-01: deve adicionar produto ao carrinho (feliz)", () => {
    openAnyProductAndAddToCart();
    openCart();

    cy.contains("Carrinho").should("be.visible");
    cy.get('input.qty').should("have.value", "1");
  });

  it("CT-US001-02: não deve permitir mais de 10 unidades do mesmo produto", () => {
    openAnyProductAndAddToCart();
    openCart();

    setQuantity(10);
    cy.get('input.qty').should("have.value", "10");

    setQuantity(11);
    assertNoticeVisible(); // mensagem de limite (ajusta o texto depois)
  });
});