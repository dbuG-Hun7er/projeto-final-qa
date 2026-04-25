/**
 * performance/k6/login_smoke.js
 * ─────────────────────────────────────────────────────────────────
 * Teste de performance – Login (autenticação via WooCommerce)
 *
 * Configurações (conforme especificação):
 *   VUs      : 20
 *   Duração  : 2 minutos
 *   Ramp-up  : 20 segundos (0 → 20 VUs)
 *
 * Variáveis de ambiente:
 *   SITE_URL   – ex: http://lojaebac.ebaconline.art.br (sem barra final)
 *
 * A massa de dados (user1_ebac a user5_ebac) já está embutida no script
 * conforme especificação do trabalho.
 *
 * Execução:
 *   export SITE_URL="http://lojaebac.ebaconline.art.br"
 *   k6 run performance/k6/login_smoke.js
 * ─────────────────────────────────────────────────────────────────
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';


const USERS = [
  { username: 'user1_ebac', password: 'psw!ebac@test' },
  { username: 'user2_ebac', password: 'psw!ebac@test' },
  { username: 'user3_ebac', password: 'psw!ebac@test' },
  { username: 'user4_ebac', password: 'psw!ebac@test' },
  { username: 'user5_ebac', password: 'psw!ebac@test' },
];

export const options = {
  stages: [
    { duration: '20s', target: 20 },  // ramp-up: 0 → 20 VUs em 20s
    { duration: '100s', target: 20 }, // sustentado: 20 VUs por ~1min40s
    { duration: '20s', target: 0 },   // ramp-down: 20 → 0 VUs
  ],
  thresholds: {
    http_req_failed:    ['rate<0.02'],   // < 2% de falhas gerais
    http_req_duration:  ['p(95)<3000'],  // p95 abaixo de 3 segundos
    login_errors:       ['count<5'],     // máximo de 5 falhas de login
    login_success_rate: ['rate>0.95'],   // pelo menos 95% de sucesso
  },
};


const loginErrors      = new Counter('login_errors');
const loginDuration    = new Trend('login_duration_ms', true);
const loginSuccessRate = new Rate('login_success_rate');

function getSiteUrl() {
  const url = __ENV.SITE_URL || 'http://lojaebac.ebaconline.art.br';
  return url.replace(/\/$/, '');
}

function pickUser(vuId) {
  return USERS[vuId % USERS.length];
}


export function setup() {
  const siteUrl = getSiteUrl();
  console.log(`[setup] Alvo: ${siteUrl}/wp-login.php`);
  console.log(`[setup] Massa de dados: ${USERS.length} usuários`);
  console.log(`[setup] VUs: 20 | Duração: 2 min | Ramp-up: 20s`);
  return { siteUrl };
}


export default function (data) {
  const creds   = pickUser(__VU);
  const siteUrl = data.siteUrl;

  group('Login via WooCommerce', () => {

    // Passo 1: GET na página de login (obtém nonce/cookies)
    const loginPageUrl = `${siteUrl}/minha-conta/`;
    const pageRes = http.get(loginPageUrl, {
      tags: { name: 'GET /minha-conta' },
    });

    check(pageRes, {
      'página de login acessível (200)': (r) => r.status === 200,
    });

    
    let nonce = '';
    const nonceMatch = pageRes.body && pageRes.body.match(/name="woocommerce-login-nonce"\s+value="([^"]+)"/);
    if (nonceMatch) nonce = nonceMatch[1];

  
    const loginUrl = `${siteUrl}/minha-conta/`;
    const payload  = {
      username:                    creds.username,
      password:                    creds.password,
      'woocommerce-login-nonce':   nonce,
      _wp_http_referer:            '/minha-conta/',
      login:                       'Entrar',
    };

    const params = {
      redirects: 3,
      tags:      { name: 'POST /minha-conta (login)' },
      headers:   { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    const start   = Date.now();
    const loginRes = http.post(loginUrl, payload, params);
    const elapsed = Date.now() - start;

    loginDuration.add(elapsed);

    // Verificações de sucesso
    const ok = check(loginRes, {
      'login respondeu (200 ou 302)': (r) => r.status === 200 || r.status === 302,
      'sem mensagem de erro de credencial': (r) =>
        !r.body || !r.body.includes('senha incorreta') && !r.body.includes('usuário desconhecido'),
      'redirecionado ou logado': (r) =>
        r.status === 302 ||
        (r.body && (r.body.includes('sair') || r.body.includes('logout') || r.body.includes('Minha conta'))),
    });

    loginSuccessRate.add(ok);
    if (!ok) {
      loginErrors.add(1);
      console.warn(`[VU ${__VU}] Falha no login com ${creds.username} – status: ${loginRes.status}`);
    }
  });

  sleep(1 + Math.random() * 2); // 1–3s de pausa entre iterações
}

// ── Teardown ──────────────────────────────────────────────────────
export function teardown(data) {
  console.log(`[teardown] Teste de login finalizado. Alvo: ${data.siteUrl}`);
}
