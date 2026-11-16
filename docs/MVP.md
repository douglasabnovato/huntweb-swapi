# MVP — huntweb-swapi

> Criado em 02/11/2026. Revisto em 16/11/2026, no ciclo do processo por repositório. Este arquivo é a fonte única do estado. Testado no Windows (Node 24) e no CI (Ubuntu, Node 22). Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta: 10 critérios.

**Resumo:** 10 de 10 aplicáveis atendidos

**Finalizado:** sim

**Estado em 16/11/2026:** os 10 critérios aplicáveis atendem. Na revisão deste ciclo, os critérios 3 e 8 estavam marcados "Atende" só com testes no jsdom; voltaram a "Parcial" e passaram a "Atende" com o teste Playwright com axe no CI (PR #37, run 43798156159). O site segue fora do ar até o responsável ligar o Pages (#25); o critério 7, que mediria o site publicado, não se aplica em N1.

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem estuda React consulta personagens de Star Wars numa lista com busca e detalhe | README (topo) e `docs/PLANO-DE-ACAO.md`, ciclo de 16/11/2026 | 16/11/2026 |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende: seção 2, com meta e "saberemos quando"; a parte com pessoas depende do site no ar (#42) | Seção 2 | 16/11/2026 |
| 3 | Fluxo principal completo | Teste de ponta a ponta no navegador no CI | Atende: `e2e/fluxo.e2e.js` busca "luke", abre o detalhe pelo teclado, volta com a busca mantida, abre `/huntweb-swapi/people/5` direto e trata a SWAPI fora do ar, no Chromium sobre o build (`npm run preview`), com a SWAPI simulada | `npm run test:e2e` no job `e2e`, run 43798156159 do PR #37: 3 passed | 16/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 | 16/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — | 16/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta | Atende: busca vazia, rede caída, SWAPI fora do ar (5xx), tempo esgotado (15 s), personagem inexistente e rota inexistente têm mensagem; lista e detalhe têm "Tentar de novo" | `npm test` (11 testes no Vitest) e o teste "SWAPI fora do ar" no Playwright, run 43798156159 | 16/11/2026 |
| 7 | Desempenho aceitável | LCP até 2,5 s no celular | Não se aplica (N1) | — | 16/11/2026 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) sem violações na lista, no detalhe e no aviso de erro, em largura de desktop; Tab até o link do personagem com foco visível (`outline` diferente de `none`), Enter e "Voltar" pelo teclado. O axe achou e o ciclo corrigiu o nome do link "Acessar" (WCAG 2.5.3). Só modo claro: o app não tem tema escuro próprio (#39) | `npm run test:e2e`, run 43798156159 do PR #37: 3 passed | 16/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Atende: `npm audit --omit=dev` e `npm audit` com 0 vulnerabilidades depois de subir `vite`, `vitest` e `source-map-js` (9 alertas do Dependabot, todos de desenvolvimento, fecham no merge na `master`); sem segredo nem dado pessoal (dados de teste fictícios) | `npm audit` em 16/11/2026: "found 0 vulnerabilities"; `gh api repos/douglasabnovato/huntweb-swapi/dependabot/alerts?state=open`: 9 antes do merge | 16/11/2026 |
| 10 | Entrega confiável | CI nos PRs e principal protegida | Atende: ruleset `principal-protegida` ativo com `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`raiz`); workflow `CI` roda nos PRs para `master` e `developer/**`. Exigir também o `e2e` é do responsável (#38) | `gh api repos/douglasabnovato/huntweb-swapi/rules/branches/master` em 16/11/2026 | 16/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI, sem `skipped` | Atende: 11 testes no Vitest (job `raiz`) e 3 no Playwright (job `e2e`), nenhum pulado | Run 43798156159: "Tests 11 passed (11)" e "3 passed" | 16/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto | Atende: README reescrito para a versão atual; comandos conferidos contra o `package.json` (`dev`, `test`, `build`, `preview`, `test:e2e`); links do README conferidos com `curl` (dois quebrados saíram); sem link publicado, porque o site dá 404 | `curl` dos links do README em 16/11/2026; `npm ci`, `npm test`, `npm run build` e `npm run test:e2e` numa cópia nova | 16/11/2026 |

## 2. Hipótese

Acreditamos que a lista com busca e detalhe deixa qualquer pessoa achar um personagem sem ajuda.

- **Meta:** achar "Luke Skywalker" e abrir o detalhe em até 3 passos (digitar, buscar, abrir).
- **Saberemos quando:** o teste de navegador fizer o percurso só com o teclado no CI (feito em 16/11/2026, run 43798156159) e 3 pessoas fizerem o mesmo no site publicado sem ajuda (#42, depende do site no ar, #25).

## 3. Fora do MVP

Favoritos, contas, demais recursos da SWAPI (planetas, espécies e naves ficam na #28), tema escuro (#39) e domínio próprio.

## 4. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Falha da SWAPI testada, limite de tempo e "Tentar de novo" no detalhe | Feito (#31) |
| 2 | Filmes do personagem no detalhe | Feito (#31) |
| 3 | CI nos PRs para a `developer` | Feito (#31) |
| 4 | Proteger a `master` | Feito em 10/11/2026 (#26) |
| 5 | Teste de navegador com axe e job `e2e` | Feito em 16/11/2026 (#29, PR #37) |
| 6 | README da versão atual | Feito em 16/11/2026 (#30, PR #37) |
| 7 | Título da aba por página e busca que acompanha a URL | Feito em 16/11/2026 (PR #37) |
| 8 | Ligar o Pages | Workflow pronto; ligar é do responsável (#25) |
| 9 | Exigir o `e2e` no ruleset | Responsável (#38) |
| 10 | API de reserva | Issue (#27) |
