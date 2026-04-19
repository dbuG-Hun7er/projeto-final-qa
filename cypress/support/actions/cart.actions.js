import { CartPage } from "../pages/cart.page";

export const openAnyProductAndAddToCart = () => {
  cy.visit("/produtos");
  cy.contains("a", "Comprar").first().click({ force: true });
  cy.get(CartPage.addToCartBtn).click();
};

export const openCart = () => {
  cy.get(CartPage.cartLink).click();
};

export const setQuantity = (qty) => {
  cy.get(CartPage.qtyInput).clear().type(String(qty));
  cy.get(CartPage.updateCartBtn).click();
};

export const assertNoticeVisible = () => {
  cy.get(CartPage.notice).should("be.visible");
};