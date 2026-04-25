import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 1),
  iterations: Number(__ENV.ITERATIONS || 5),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

const siteUrl = __ENV.SITE_URL || 'http://lojaebac.ebaconline.art.br';
const username = __ENV.LOGIN_USER;
const password = __ENV.LOGIN_PASS;

if (!username || !password) {
  throw new Error('Defina LOGIN_USER e LOGIN_PASS antes de rodar o teste de login smoke.');
}

export default function () {
  const payload = {
    username,
    password,
    login: 'Acessar',
  };

  const res = http.post(`${siteUrl}/minha-conta/`, payload, {
    tags: { endpoint: 'POST /minha-conta/' },
  });

  check(res, {
    'status não é 5xx': (r) => r.status < 500,
    'retorno contém minha-conta': (r) => r.body.includes('minha-conta') || r.url.includes('minha-conta'),
  });

  sleep(1);
}
