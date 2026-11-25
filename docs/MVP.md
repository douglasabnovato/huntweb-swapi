# MVP — huntweb-swapi

> Criado em 02/11/2026. Revisto em 16/11/2026, no ciclo do processo por repositório, e de novo às 12h27, com os alertas do Dependabot ligados (critério 9). Revisto em 18/11/2026, com o site no ar, o lint no CI e o foco no título a cada troca de rota. Revisto em 21/11/2026: o ciclo de 18/11 está na `master` desde 19/11 (PR #49), e o README virou vitrine, com capturas do site. Este arquivo é a fonte única do estado. Testado no Windows (Node 24) e no CI (Ubuntu, Node 22). Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta: 10 critérios.

**Resumo:** 10 de 10 aplicáveis atendidos

**Finalizado:** sim. Os 10 critérios aplicáveis atendem; o 9 voltou a "Atende" em 16/11/2026, depois do merge do #36 na `master`, com 0 alertas abertos do Dependabot.

**Estado em 18/11/2026:** os 10 critérios aplicáveis atendem. O responsável ligou o Pages (origem GitHub Actions), e o site responde em https://douglasabnovato.github.io/huntweb-swapi/ com o build do commit `51c94e3` da `master` (deploy de 16/11/2026). O link direto e a página não encontrada funcionam no site. O critério 7, que mediria o site publicado, não se aplica em N1.

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem estuda React consulta personagens de Star Wars numa lista com busca e detalhe | README (topo) e `docs/PLANO-DE-ACAO.md`, ciclo de 16/11/2026 | 16/11/2026 |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende: seção 2, com meta e "saberemos quando"; a parte com pessoas depende do site no ar (#42) | Seção 2 | 16/11/2026 |
| 3 | Fluxo principal completo | Teste de ponta a ponta no navegador no CI | Atende: `e2e/fluxo.e2e.js` faz o percurso só pelo teclado desde o topo (Tab até a busca, digita "luke", Enter, Tab até o link, Enter, Tab até "Voltar", Enter), confere a busca mantida e o voltar do navegador, abre `/huntweb-swapi/people/5` direto e trata a SWAPI fora do ar, no Chromium sobre o build (`npm run preview`), com a SWAPI simulada e sem nova tentativa (`retries: 0`). Confere também que o build tem o `404.html` que o Pages usa no link direto. No site publicado, o link direto abre o detalhe | `npm run test:e2e` no job `e2e`, run 43799127062 do PR #37: 4 passed. Site: Chromium sem interface em `/huntweb-swapi/people/1` mostrou o h1 "Luke Skywalker" e `/huntweb-swapi/xyz` mostrou "Página não encontrada", 18/11/2026 19h56 | 18/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 | 16/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — | 16/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta | Atende: busca vazia, rede caída, SWAPI fora do ar (5xx), tempo esgotado (15 s), personagem inexistente e rota inexistente têm mensagem; lista e detalhe têm "Tentar de novo" | `npm test` (11 testes no Vitest) e o teste "SWAPI fora do ar" no Playwright, run 43799127062 | 16/11/2026 |
| 7 | Desempenho aceitável | LCP até 2,5 s no celular | Não se aplica (N1) | — | 16/11/2026 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) sem violações na lista, no detalhe e no aviso de erro, em largura de desktop; percurso só pelo teclado, com o contorno de foco do app no link (`3px solid`, do `:focus-visible`). A cada troca de rota, o foco vai para o h1 da página (#41); na primeira carga, fica no topo. O axe achou e o ciclo corrigiu o nome do link "Acessar" (WCAG 2.5.3). Só modo claro: o app não tem tema escuro próprio (fora do MVP) | `npm run test:e2e`, run 43799127062 do PR #37: 4 passed; com o foco no título, `E2E_PORT=4150 npx playwright test` em 18/11/2026: 4 passed (e falha sem a correção) | 18/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Atende: o #36 entrou na `master` em 16/11/2026 e os 9 alertas de desenvolvimento (`vite`, `source-map-js`, `@vitest/mocker`) foram resolvidos; 0 alertas abertos e 0 vulnerabilidades de produção. Sem segredo nem dado pessoal (dados de teste fictícios) | `gh api "repos/douglasabnovato/huntweb-swapi/dependabot/alerts?state=open&per_page=100"`, 16/11/2026 12h27: 0 abertos; `npm ci` e `npm audit --omit=dev`, 16/11/2026 12h29: "found 0 vulnerabilities" | 16/11/2026 |
| 10 | Entrega confiável | CI nos PRs e principal protegida | Atende: ruleset `principal-protegida` ativo com `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`raiz`); workflow `CI` roda nos PRs para `master` e `developer/**`. Exigir também o `e2e` é do responsável (#38) | `gh api repos/douglasabnovato/huntweb-swapi/rules/branches/master` em 16/11/2026 | 16/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI, sem `skipped` | Atende: lint (ESLint 10 com as regras dos hooks do React), 11 testes no Vitest (job `raiz`) e 4 no Playwright (job `e2e`), nenhum pulado | Run 43799127062: "Tests 11 passed (11)" e "4 passed"; `npm run lint` em 18/11/2026: 0 erros | 18/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto | Atende: README reescrito para a versão atual; comandos conferidos contra o `package.json` (`dev`, `lint`, `test`, `build`, `preview`, `test:e2e`); links do README conferidos com `curl` (dois quebrados saíram); o link publicado voltou ao README, porque o site responde | `curl -sI https://douglasabnovato.github.io/huntweb-swapi/` em 18/11/2026: 200, `title` "Huntweb SWAPI"; `npm ci`, `npm run lint`, `npm test`, `npm run build` e `npm run test:e2e` numa cópia nova, 18/11/2026 | 18/11/2026 |

## 2. Hipótese

Acreditamos que a lista com busca e detalhe deixa qualquer pessoa achar um personagem sem ajuda.

- **Meta:** achar "Luke Skywalker" e abrir o detalhe em até 3 passos (digitar, buscar, abrir).
- **Saberemos quando:** o teste de navegador fizer o percurso só com o teclado no CI (feito em 16/11/2026, run 43799127062) e 3 pessoas fizerem o mesmo no site publicado sem ajuda (#42; o site está no ar desde 16/11/2026).

## 3. Fora do MVP

Favoritos, contas, demais recursos da SWAPI (planetas, espécies e naves, #28), tema escuro (#39), API de reserva quando a swapi.dev cai (#27) e domínio próprio. As três issues foram fechadas como não planejadas em 18/11/2026: são funcionalidade nova, e o nível é N1.

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
| 8 | Ligar o Pages | Ligado pelo responsável; site no ar, conferido em 18/11/2026 (#25) |
| 9 | Exigir o `e2e` no ruleset | Responsável (#38) |
| 10 | API de reserva | Fora do MVP em N1 (#27, não planejada) |
| 11 | ESLint no CI | Feito em 18/11/2026 (#40); na `master` desde 19/11/2026 (PR #49) |
| 12 | Foco no título quando a rota muda | Feito em 18/11/2026 (#41); na `master` desde 19/11/2026 (PR #49) |
| 13 | Capturas do README com as telas atuais do site | Feito em 21/11/2026 (#51), falta a `master` |

## 5. Histórico

- 21/11/2026: README reescrito como vitrine (o que é, "experimente em 30 segundos", telas atuais do site e destaques de engenharia), com capturas novas do site publicado (#51). Conferido no mesmo dia: o site responde 200, o CI da `master` está verde (run do PR #49) e há 0 alertas abertos do Dependabot. Sem mudança de critério: segue 10 de 10; Finalizado: sim.
- 18/11/2026: site no ar (Pages ligado pelo responsável); lint no CI (#40); foco no título a cada troca de rota (#41); #27, #28 e #39 fechadas como não planejadas em N1. Resumo segue 10 de 10; Finalizado: sim.
- 16/11/2026, 12h27: depois do merge do #36 na `master`, os alertas do Dependabot caíram de 9 para 0; o critério 9 passou de "Parcial" a "Atende". Resumo: 9 → 10 de 10; Finalizado: não → sim.
