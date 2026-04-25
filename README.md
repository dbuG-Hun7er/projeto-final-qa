# Projeto Final QA Automation

Automação de testes para:
- **UI (Cypress)**: US001 carrinho e US002 login
- **API (Supertest + Mocha/Chai)**: US003 cupons
- **Performance (k6)**: smoke de login e carga leve de listagem de cupons

## Estrutura

```text
cypress/
  e2e/
    us001-add-to-cart.cy.js
    us002-login.cy.js
  fixtures/users.json
  support/
    commands.js
    e2e.js
    pages/
      cart.page.js
      login.page.js
    actions/
      cart.actions.js
      login.actions.js

api-tests/
  src/client.js
  tests/us003-coupons.spec.js

performance/
  k6/
    coupons_get.js
    login_smoke.js
```

## Pré-requisitos

- Node.js 18+
- npm
- [k6](https://k6.io/docs/get-started/installation/) (para testes de performance)

## Instalação

Na raiz do projeto:

```bash
npm install
npm --prefix api-tests install
```

## Execução dos testes

### UI (Cypress)

```bash
npm run cy:open
npm run cy:run
```

### API (US003)

Defina as variáveis de ambiente antes de rodar:

```bash
export COUPONS_BASE_URL="https://SEU_HOST/wp-json/wc/v3"
export COUPONS_USER="seu_usuario"
export COUPONS_PASS="seu_password"
```

Execute:

```bash
npm run api:test
```

> Se essas variáveis não estiverem definidas, a suíte US003 será marcada como *pending* (pulada) para não quebrar o pipeline.

### Performance (k6)

#### 1) GET de cupons

```bash
export COUPONS_BASE_URL="https://SEU_HOST/wp-json/wc/v3"
export COUPONS_USER="seu_usuario"
export COUPONS_PASS="seu_password"
npm run perf:coupons
```

Parâmetros opcionais:

```bash
VUS=10 DURATION=60s npm run perf:coupons
```

#### 2) Login smoke

```bash
export SITE_URL="http://lojaebac.ebaconline.art.br"
export LOGIN_USER="usuario_valido"
export LOGIN_PASS="senha_valida"
npm run perf:login
```

Parâmetro opcional:

```bash
ITERATIONS=20 npm run perf:login
```

## Scripts disponíveis (raiz)

```bash
npm run cy:open
npm run cy:run
npm run ui:test
npm run api:test
npm run perf:coupons
npm run perf:login
npm test
```

## Relatórios

Os relatórios do Cypress (Mochawesome) ficam em:

```text
cypress/reports/
```

Evidências adicionais:

```text
cypress/screenshots/
cypress/videos/
```

## Cobertura implementada

- **US001**: adicionar ao carrinho (feliz) + limite de 10 unidades
- **US002**: login feliz + login inválido
- **US003**:
  - POST cupom (feliz)
  - POST cupom duplicado
  - GET lista de cupons
  - GET cupom por ID
- **Performance**:
  - `coupons_get.js`: carga leve para `GET /coupons` com threshold de erro e latência (p95)
  - `login_smoke.js`: smoke de login com validação de status e retorno esperado
