const request = require("supertest");

const BASE_URL = process.env.COUPONS_BASE_URL;
const USER = process.env.COUPONS_USER;
const PASS = process.env.COUPONS_PASS;

if (!BASE_URL || !USER || !PASS) {
  throw new Error("Defina COUPONS_BASE_URL, COUPONS_USER e COUPONS_PASS no ambiente.");
}

const api = () =>
  request(BASE_URL)
    .auth(USER, PASS); // Basic Auth (supertest)

module.exports = { api };