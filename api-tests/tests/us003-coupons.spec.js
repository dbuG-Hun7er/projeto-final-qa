const { expect } = require("chai");
const { api } = require("../src/client");

describe("US003 - API de Cupons", () => {
  it("CT-US003-01: deve criar cupom com campos obrigatórios (POST)", async () => {
    const code = `ganhe10_${Date.now()}`;

    const res = await api()
      .post("/coupons")
      .send({
        code,
        amount: "10.00",
        discount_type: "fixed_cart",
        description: "Cupom de teste"
      });

    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.have.property("code");
  });

  it("CT-US003-02: não deve permitir code repetido", async () => {
    const code = `dup_${Date.now()}`;

    const first = await api().post("/coupons").send({
      code,
      amount: "10.00",
      discount_type: "fixed_cart",
      description: "Primeiro"
    });
    expect(first.status).to.be.oneOf([200, 201]);

    const second = await api().post("/coupons").send({
      code,
      amount: "10.00",
      discount_type: "fixed_cart",
      description: "Duplicado"
    });

    // Ajustar conforme a API responde (400/409 etc.)
    expect(second.status).to.be.oneOf([400, 409, 422]);
  });
});