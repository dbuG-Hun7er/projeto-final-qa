import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 5),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1200'],
  },
};

const baseUrl = __ENV.COUPONS_BASE_URL;
const user = __ENV.COUPONS_USER;
const pass = __ENV.COUPONS_PASS;

if (!baseUrl || !user || !pass) {
  throw new Error('Defina COUPONS_BASE_URL, COUPONS_USER e COUPONS_PASS antes de rodar o k6.');
}

export default function () {
  const res = http.get(`${baseUrl}/coupons`, {
    auth: 'basic',
    headers: {
      Authorization: `Basic ${encoding.b64encode(`${user}:${pass}`)}`,
    },
    tags: { endpoint: 'GET /coupons' },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'resposta em array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
