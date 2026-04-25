const { expect } = require("chai");
const { api, hasApiConfig, missingConfig } = require("../src/client");

describe("US003 - API de Cupons", function () {
  before(function () {
    if (!hasApiConfig()) {
      console.warn(
        `[US003] Pulando suite: defina ${missingConfig.join(", ")} para executar testes de API.`
      );
      this.skip();
    }
  });

  it("CT-US003-01: deve criar cupom com campos obrigatórios (POST feliz)", async () => {
    const code = `ganhe10_${Date.now()}`;

    const res = await api().post("/coupons").send({
      code,
      amount: "10.00",
      discount_type: "fixed_cart",
      description: "Cupom de teste",
    });

    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.include({ code });
  });

  it("CT-US003-02: não deve permitir code repetido (POST duplicado)", async () => {
    const code = `dup_${Date.now()}`;

    const first = await api().post("/coupons").send({
      code,
      amount: "10.00",
      discount_type: "fixed_cart",
      description: "Primeiro",
    });

    expect(first.status).to.be.oneOf([200, 201]);

    const second = await api().post("/coupons").send({
      code,
      amount: "10.00",
      discount_type: "fixed_cart",
      description: "Duplicado",
    });

    expect(second.status).to.be.oneOf([400, 409, 422]);
  });

  it("CT-US003-03: deve listar cupons (GET /coupons)", async () => {
    const res = await api().get("/coupons");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("CT-US003-04: deve buscar cupom por ID (GET /coupons/{id})", async () => {
    const list = await api().get("/coupons");

    expect(list.status).to.equal(200);
    expect(list.body).to.be.an("array").that.is.not.empty;

    const couponId = list.body[0].id;
    const res = await api().get(`/coupons/${couponId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", couponId);
  });
});
