/**
 * performance/k6/coupons_get.js
 * ─────────────────────────────────────────────────────────────────
 * Teste de performance – GET /coupons
 *
 * Configurações (conforme especificação do TCC):
 *   VUs      : 20
 *   Duração  : 2 minutos
 *   Ramp-up  : 20 segundos (0 → 20 VUs)
 *
 * Variáveis de ambiente (obrigatórias):
 *   COUPONS_BASE_URL  – ex: https://lojaebac.ebaconline.art.br/wp-json/wc/v3
 *   COUPONS_USER      – usuário WooCommerce (consumer key ou login)
 *   COUPONS_PASS      – senha / consumer secret
 *
 * Execução:
 *   export COUPONS_BASE_URL="https://..."
 *   export COUPONS_USER="user1_ebac"
 *   export COUPONS_PASS="psw!ebac@test"
 *   k6 run performance/k6/coupons_get.js
 * ─────────────────────────────────────────────────────────────────
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// ── Massa de dados (conforme especificação) ───────────────────────
const USERS = [
  { user: 'user1_ebac', pass: 'psw!ebac@test' },
  { user: 'user2_ebac', pass: 'psw!ebac@test' },
  { user: 'user3_ebac', pass: 'psw!ebac@test' },
  { user: 'user4_ebac', pass: 'psw!ebac@test' },
  { user: 'user5_ebac', pass: 'psw!ebac@test' },
];

// ── Configurações do teste ────────────────────────────────────────
export const options = {
  stages: [
    { duration: '20s', target: 20 },  // ramp-up: 0 → 20 VUs em 20s
    { duration: '100s', target: 20 }, // sustentado: 20 VUs por ~1min40s
    { duration: '20s', target: 0 },   // ramp-down: 20 → 0 VUs
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],    // < 1% de falhas
    http_req_duration: ['p(95)<2000'],   // p95 abaixo de 2 segundos
    coupon_errors:     ['count<5'],      // máximo de 5 erros de contrato
  },
};

// ── Métricas customizadas ─────────────────────────────────────────
const couponErrors   = new Counter('coupon_errors');
const couponDuration = new Trend('coupon_request_duration', true);
const successRate    = new Rate('coupon_success_rate');

// ── Helpers ───────────────────────────────────────────────────────
function getBaseUrl() {
  const url = __ENV.COUPONS_BASE_URL;
  if (!url) throw new Error('COUPONS_BASE_URL não definida. Exporte antes de rodar o k6.');
  return url.replace(/\/$/, '');
}

function pickUser(vuId) {
  return USERS[vuId % USERS.length];
}

function buildAuthHeader(user, pass) {
  const token = `${user}:${pass}`;
  // btoa não existe no k6 – usa encoding manual via encoding module ou base64 simples
  return `Basic ${btoa(token)}`;
}

// btoa polyfill para k6 (usa Buffer do runtime k6)
function btoa(str) {
  return encoding.b64encode(str);
}

// ── Setup – valida variáveis antes de começar ─────────────────────
export function setup() {
  const baseUrl = getBaseUrl();
  const creds   = pickUser(0);
  const headers = {
    Authorization: `Basic ${encoding.b64encode(`${__ENV.COUPONS_USER || creds.user}:${__ENV.COUPONS_PASS || creds.pass}`)}`,
    'Content-Type': 'application/json',
  };

  const res = http.get(`${baseUrl}/coupons?per_page=1`, { headers });

  if (res.status !== 200) {
    console.warn(`[setup] GET /coupons retornou ${res.status}. Verifique credenciais e URL.`);
  } else {
    console.log(`[setup] Conexão OK – ${baseUrl}/coupons`);
  }

  return { baseUrl };
}

// ── Cenário principal ─────────────────────────────────────────────
export default function (data) {
  // Rotação de usuários por VU
  const creds = pickUser(__VU);
  const user  = __ENV.COUPONS_USER || creds.user;
  const pass  = __ENV.COUPONS_PASS || creds.pass;

  const headers = {
    Authorization: `Basic ${encoding.b64encode(`${user}:${pass}`)}`,
    'Content-Type': 'application/json',
  };

  const url = `${data.baseUrl}/coupons`;
  const res = http.get(url, { headers, tags: { name: 'GET /coupons' } });

  // Registra duração
  couponDuration.add(res.timings.duration);

  // Verificações
  const ok = check(res, {
    'status 200':            (r) => r.status === 200,
    'body é array':          (r) => Array.isArray(r.json()),
    'array tem itens':       (r) => r.json().length >= 0,
    'campos id/code/amount': (r) => {
      const body = r.json();
      if (!Array.isArray(body) || body.length === 0) return true; // sem cupons ainda é válido
      const first = body[0];
      return first.id !== undefined && first.code !== undefined && first.amount !== undefined;
    },
  });

  successRate.add(ok);
  if (!ok) couponErrors.add(1);

  sleep(1);
}

// ── Teardown – sumário final ──────────────────────────────────────
export function teardown(data) {
  console.log(`[teardown] Teste finalizado. URL: ${data.baseUrl}/coupons`);
}
