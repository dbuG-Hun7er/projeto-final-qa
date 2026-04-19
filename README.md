# QA Automation — Projeto Final (Cypress UI + Supertest/Mocha API)

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Cypress](https://img.shields.io/badge/cypress-e2e-brightgreen)
![Mocha](https://img.shields.io/badge/mocha-api%20tests-brown)
![License](https://img.shields.io/badge/license-MIT-blue)

> ✅ **Status CI (GitHub Actions)**  
> Os badges abaixo funcionam quando você criar os workflows em `.github/workflows/`:
>
> ![UI Tests](https://github.com/dbuG-Hun7er/projeto-final-qa/tree/main/cypress)
> ![API Tests](https://github.com/dbuG-Hun7er/projeto-final-qa/tree/main/api-tests)

Projeto final de **Engenharia de Qualidade de Software**, com foco em:
- **Planejamento e execução** de testes por US (US001/US002/US003)
- **Automação UI** com Cypress + **relatórios Mochawesome**
- **Automação API** com Supertest + Mocha/Chai
- **Evidências** e **Bug Reports** padronizados

---

## 📌 Escopo por Histórias de Usuário

### US001 — Carrinho
- Limite **10** unidades do mesmo produto
- Total do carrinho até **R$ 990,00**
- Cupons:
  - **R$200–R$600** → 10%
  - **> R$600** → 15%

### US002 — Login
- Login somente para **usuário ativo**
- Erro com credenciais inválidas
- **Bloqueio após 3 tentativas** por **15 min**

### US003 — API de Cupons
- **Basic Auth** obrigatório
- `GET /coupons` | `GET /coupons/{id}` | `POST /coupons`
- `code` **não pode repetir**
- Campos obrigatórios: `code`, `amount`, `discount_type`, `description`

---

## 🧱 Arquitetura (Clean & Escalável)

Princípios:
- **Specs pequenos** (legíveis e focados)
- `pages/` → **somente selectors**
- `actions/` → **fluxos de negócio**
- **sem** `cy.wait()` fixo (preferir `cy.intercept()` quando necessário)

### Estrutura

```text
cypress/
  e2e/
    us001-add-to-cart.cy.js
    us002-login.cy.js
  fixtures/
    users.json
  support/
    e2e.js
    commands.js
    pages/
      cart.page.js
      login.page.js
    actions/
      cart.actions.js
      login.actions.js

api-tests/
  src/
    client.js
  test/
    us003-coupons.spec.js
  package.json
```

---

## ✅ Requisitos
- Node.js **18+**
- NPM

---

## 🚀 Como rodar (UI — Cypress)

### Instalar dependências
```bash
npm install
```

### Abrir Cypress (interativo)
```bash
npm run cy:open
```

### Rodar Cypress (headless)
```bash
npm run cy:run
```

---

## 📄 Relatórios (Mochawesome)

Após executar `npm run cy:run`, os relatórios ficam em:

```text
cypress/reports/
```

Inclui:
- HTML + JSON
- evidências (screenshots embutidas quando falha)

---

## 🔌 Como rodar (API — Supertest/Mocha)

### Instalar dependências da API
```bash
cd api-tests
npm install
```

### Variáveis de ambiente (Basic Auth + Base URL)

#### PowerShell (sessão atual)
```powershell
$env:COUPONS_BASE_URL="https://SUA-URL-AQUI"
$env:COUPONS_USER="admin_ebac"
$env:COUPONS_PASS="SUA_SENHA_AQUI"
```

#### CMD
```bat
set COUPONS_BASE_URL=https://SUA-URL-AQUI
set COUPONS_USER=admin_ebac
set COUPONS_PASS=SUA_SENHA_AQUI
```

### Rodar os testes (na raiz do projeto)
```bash
npm run api:test
```

---

## 🧪 Scripts

Exemplo esperado no `package.json` (raiz):

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "api:test": "npm --prefix api-tests test"
  }
}
```

---

## 🐞 Evidências e Bug Report

Evidências UI:
- `cypress/screenshots/`
- `cypress/videos/`

Bug report:
- usar o template do projeto (ex.: `Bug_Report.pdf`)
- registrar: passos, resultado atual, esperado, ambiente, gravidade/prioridade, evidência

---

## 🔁 CI/CD (GitHub Actions)

Este projeto suporta pipeline separado para:
- **UI tests (Cypress)**
- **API tests (Mocha/Supertest)**

Arquivos esperados:
- `.github/workflows/ui-tests.yml`
- `.github/workflows/api-tests.yml`

---

## 🧾 Convenção de commits (sugestão)

- `test:` novo teste / melhoria
- `fix:` correção
- `chore:` config/infra
- `docs:` documentação

Exemplos:
- `test: add US001 cart limit coverage`
- `fix: stabilize login selectors`
- `chore: configure mochawesome reporter`

---

## 🗺 Roadmap
- [ ] Cobertura mínima (feliz + alternativo/negativo) para US001/US002/US003
- [ ] Intercepts para estabilidade quando necessário
- [ ] CI com GitHub Actions (UI + API)
- [ ] Padronizar massa de dados (fixtures/factory)

---

## 👤 Autor
Lucas — QA Automation (Cypress / API Testing)
