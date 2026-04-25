import { CartPage } from "../pages/cart.page";

export const openAnyProductAndAddToCart = () => {
  cy.visit("/produtos");
  cy.contains("a", "Comprar").first().click({ force: true });

  cy.intercept("POST", "**/?wc-ajax=add_to_cart").as("addToCart");
  cy.get(CartPage.addToCartBtn).click();
  cy.wait("@addToCart").its("response.statusCode").should("eq", 200);
};

export const openCart = () => {
  cy.get(CartPage.cartLink).click();
  cy.get(CartPage.cartTitle).should("contain.text", "Carrinho");
};

export const setQuantity = (qty) => {
  cy.get(CartPage.qtyInput).clear().type(String(qty));
  cy.get(CartPage.updateCartBtn).click();
};

export const assertNoticeVisible = () => {
  cy.get(CartPage.notice).should("be.visible");
};
