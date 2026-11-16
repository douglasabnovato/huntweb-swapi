# MVP — huntweb-swapi

> Criado em 02/11/2026. Revisto em 16/11/2026, no ciclo do processo por repositório, e de novo às 15h27, com os alertas do Dependabot ligados (critério 9). Este arquivo é a fonte única do estado. Testado no Windows (Node 24) e no CI (Ubuntu, Node 22). Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta: 10 critérios.

**Resumo:** 10 de 10 aplicáveis atendidos

**Finalizado:** sim. Os 10 critérios aplicáveis atendem; o 9 voltou a "Atende" em 16/11/2026, depois do merge do #36 na `master`, com 0 alertas abertos do Dependabot.

**Estado em 16/11/2026:** os 10 critérios aplicáveis atendem. Na revisão deste ciclo, os critérios 3 e 8 estavam marcados "Atende" só com testes no jsdom; voltaram a "Parcial" e passaram a "Atende" com o teste Playwright com axe no CI (PR #37, run 43799127062). O site segue fora do ar até o responsável ligar o Pages (#25); o critério 7, que mediria o site publicado, não se aplica em N1.

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem estuda React consulta personagens de Star Wars numa lista com busca e detalhe | README (topo) e `docs/PLANO-DE-ACAO.md`, ciclo de 16/11/2026 | 16/11/2026 |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende: seção 2, com meta e "saberemos quando"; a parte com pessoas depende do site no ar (#42) | Seção 2 | 16/11/2026 |
| 3 | Fluxo principal completo | Teste de ponta a ponta no navegador no CI | Atende: `e2e/fluxo.e2e.js` faz o percurso só pelo teclado desde o topo (Tab até a busca, digita "luke", Enter, Tab até o link, Enter, Tab até "Voltar", Enter), confere a busca mantida e o voltar do navegador, abre `/huntweb-swapi/people/5` direto e trata a SWAPI fora do ar, no Chromium sobre o build (`npm run preview`), com a SWAPI simulada e sem nova tentativa (`retries: 0`). Confere também que o build tem o `404.html` que o Pages usa no link direto; o link direto no Pages em si só se prova com o site no ar (#25) | `npm run test:e2e` no job `e2e`, run 43799127062 do PR #37: 4 passed | 16/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 | 16/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — | 16/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta | Atende: busca vazia, rede caída, SWAPI fora do ar (5xx), tempo esgotado (15 s), personagem inexistente e rota inexistente têm mensagem; lista e detalhe têm "Tentar de novo" | `npm test` (11 testes no Vitest) e o teste "SWAPI fora do ar" no Playwright, run 43799127062 | 16/11/2026 |
| 7 | Desempenho aceitável | LCP até 2,5 s no celular | Não se aplica (N1) | — | 16/11/2026 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) sem violações na lista, no detalhe e no aviso de erro, em largura de desktop; percurso só pelo teclado, com o contorno de foco do app no link (`3px solid`, do `:focus-visible`). O axe achou e o ciclo corrigiu o nome do link "Acessar" (WCAG 2.5.3). Só modo claro: o app não tem tema escuro próprio (#39) | `npm run test:e2e`, run 43799127062 do PR #37: 4 passed | 16/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Atende: o #36 entrou na `master` em 16/11/2026 e os 9 alertas de desenvolvimento (`vite`, `source-map-js`, `@vitest/mocker`) foram resolvidos; 0 alertas abertos e 0 vulnerabilidades de produção. Sem segredo nem dado pessoal (dados de teste fictícios) | `gh api "repos/douglasabnovato/huntweb-swapi/dependabot/alerts?state=open&per_page=100"`, 16/11/2026 15h27: 0 abertos; `npm ci` e `npm audit --omit=dev`, 16/11/2026 15h29: "found 0 vulnerabilities" | 16/11/2026 |
| 10 | Entrega confiável | CI nos PRs e principal protegida | Atende: ruleset `principal-protegida` ativo com `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`raiz`); workflow `CI` roda nos PRs para `master` e `developer/**`. Exigir também o `e2e` é do responsável (#38) | `gh api repos/douglasabnovato/huntweb-swapi/rules/branches/master` em 16/11/2026 | 16/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI, sem `skipped` | Atende: 11 testes no Vitest (job `raiz`) e 4 no Playwright (job `e2e`), nenhum pulado | Run 43799127062: "Tests 11 passed (11)" e "4 passed" | 16/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto | Atende: README reescrito para a versão atual; comandos conferidos contra o `package.json` (`dev`, `test`, `build`, `preview`, `test:e2e`); links do README conferidos com `curl` (dois quebrados saíram); sem link publicado, porque o site dá 404 | `curl` dos links do README em 16/11/2026; `npm ci`, `npm test`, `npm run build` e `npm run test:e2e` numa cópia nova | 16/11/2026 |

## 2. Hipótese

Acreditamos que a lista com busca e detalhe deixa qualquer pessoa achar um personagem sem ajuda.

- **Meta:** achar "Luke Skywalker" e abrir o detalhe em até 3 passos (digitar, buscar, abrir).
- **Saberemos quando:** o teste de navegador fizer o percurso só com o teclado no CI (feito em 16/11/2026, run 43799127062) e 3 pessoas fizerem o mesmo no site publicado sem ajuda (#42, depende do site no ar, #25).

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

## 5. Histórico

- 16/11/2026, 15h27: depois do merge do #36 na `master`, os alertas do Dependabot caíram de 9 para 0; o critério 9 passou de "Parcial" a "Atende". Resumo: 9 → 10 de 10; Finalizado: não → sim.
