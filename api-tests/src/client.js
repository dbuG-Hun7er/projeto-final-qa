const request = require("supertest");
require("dotenv").config();

const BASE_URL = process.env.COUPONS_BASE_URL;
const USER = process.env.COUPONS_USER;
const PASS = process.env.COUPONS_PASS;

const missingConfig = [
  ["COUPONS_BASE_URL", BASE_URL],
  ["COUPONS_USER", USER],
  ["COUPONS_PASS", PASS],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

const hasApiConfig = () => missingConfig.length === 0;

const api = () => {
  if (!hasApiConfig()) {
    throw new Error(`Config ausente para API: ${missingConfig.join(", ")}`);
  }

  return request(BASE_URL).auth(USER, PASS);
};

module.exports = { api, hasApiConfig, missingConfig };
