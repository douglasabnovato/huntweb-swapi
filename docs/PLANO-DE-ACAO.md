# Plano de ação — Huntweb SWAPI

Timebox: 30 min.

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Id do personagem (D1) | Alto | Baixo | ✅ |
| Must | Erros e nova tentativa (D2, D3) | Alto | Baixo | ✅ |
| Should | Contraste e foco (D4) | Médio | Baixo | ✅ axe 0 |
| Should | Voltar e 404 (D5) | Médio | Baixo | ✅ |
| Should | Busca por nome | Médio | Baixo | ✅ |
| Could | Páginas de planetas, espécies e naves (JSONs já existem) | Médio | Médio | Próximo ciclo |
| Could | Filmes do personagem no detalhe | Baixo | Baixo | Próximo ciclo |

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `master`. Nível: Estudo (N1). Critérios 5 e 7 não se aplicam.

### Produto

**Problema e público.** Quem estuda React consulta personagens de Star Wars numa lista com busca e detalhe, consumindo uma API pública.

**Hipótese e meta.** Uma pessoa acha um personagem pela busca em até 3 passos. Proposta; sem teste com pessoas.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| A SWAPI cai com frequência e há cópias comunitárias | A falha da API ganhou teste e mensagem para cada caso. A troca para uma API de reserva virou issue (#27), porque o formato das cópias precisa ser conferido ao vivo | [swapi.dev: about](https://swapi.dev/about), [DEV: Star Wars APIs em 2025](https://dev.to/simplr_sh/star-wars-apis-swapi-2025-403l) |
| `AbortSignal.timeout()` dá limite de tempo ao `fetch` | Cada chamada espera no máximo 15 s. O sinal de tempo se junta ao da troca de página com `AbortSignal.any()`; `TimeoutError` vira mensagem, `AbortError` segue silencioso | [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) |
| A resposta do personagem já traz a lista de filmes | O detalhe mostra os filmes com títulos fixos pelo id, sem 4 ou 6 chamadas a mais | [SWAPI: documentação](https://swapi.dev/documentation) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Falha da SWAPI testada e limite de tempo | Alto | Baixo | Este ciclo (#24) |
| 2 | "Tentar de novo" no detalhe | Médio | Baixo | Este ciclo (#24) |
| 3 | Filmes no detalhe | Médio | Baixo | Este ciclo (#24) |
| 4 | CI nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 5 | Ligar o Pages | Alto | Baixo | Responsável (#25) |
| 6 | Proteger a `master` | Alto | Baixo | Responsável (#26) |
| 7 | API de reserva | Médio | Médio | Issue (#27) |
| 8 | Planetas, espécies e naves | Médio | Médio | Issue (#28) |
| 9 | Teste de navegador | Médio | Médio | Issue (#29) |
| 10 | README atualizado | Baixo | Baixo | Issue (#30) |

**Fora do escopo.** Favoritos, contas e demais recursos da SWAPI.

### Engenharia

**Arquitetura.** SPA Vite + React 18 + React Router 7, com `basename` igual à `base` do build (`/huntweb-swapi/`). Todo acesso à SWAPI passa por `src/lib/swapi.js` (`getJson`, com mensagens de erro e limite de tempo). Planetas vêm do JSON local, com busca e cache para os que faltam. O build gera `404.html` para os deep links no Pages.

**Riscos.**
- A swapi.dev cai de tempos em tempos; sem reserva, o app só avisa (#27).
- O site não está no ar: Pages desligado (#25).
- Sem proteção na `master`, um push direto entra sem CI (#26).
- Navegador sem `AbortSignal.any()` (anterior a 2024) segue sem limite de tempo, só com o cancelamento por troca de página.

**Qualidade.**
- Testes: 9 no Vitest (lista, busca, paginação, detalhe, filmes, rede caída, 5xx, tempo esgotado, nova tentativa), também com a ordem embaralhada.
- CI: agora também nos PRs para `developer/**`.
- Acessibilidade: botões com nome; "Filmes" como título de seção; foco visível já conferido com axe.
- Segurança: sem segredo nem dado pessoal; `npm audit --omit=dev` sem alertas.

**Definição de pronto.** `npm ci`, `npm test` e `npm run build` passam; CI verde no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Limite de tempo e mensagens de falha, com testes.
2. "Tentar de novo" no detalhe e filmes do personagem, com testes.
3. Apagar o código antigo e incluir `developer/**` no CI.
4. `docs/MVP.md` na régua N1; README com próximos passos.

**Vira issue.** #25 e #26 (responsável); #27, #28, #29 e #30 (agente).

## Ciclo de 16/11/2026

> Branch `feature/2026-11-16` → `developer/sprint-2026-11-12` (o PR #36 para a `master` segue aberto) → `master`. Nível: Estudo (N1). Critérios 5 e 7 não se aplicam.

### Produto

**Problema e público.** Quem estuda React consulta personagens de Star Wars numa lista com busca e detalhe, consumindo uma API pública. É o repositório mais estrelado do perfil (12 estrelas): o README é a vitrine.

**Hipótese e meta.** Acreditamos que a lista com busca e detalhe deixa qualquer pessoa achar um personagem sem ajuda. Meta: achar "Luke Skywalker" e abrir o detalhe em até 3 passos (digitar, buscar, abrir). Saberemos quando o teste de navegador fizer esse percurso só com o teclado, no CI, e quando 3 pessoas fizerem o mesmo no site publicado sem ajuda.

**Análise de 16/11/2026.**
- O `MVP.md` dizia 10 de 10, mas os critérios 3 e 8 não tinham a evidência que a régua pede: não havia teste no navegador (Playwright) nem axe dentro dele. Os dois voltam a "Parcial" até este ciclo entregar o teste.
- 9 alertas do Dependabot abertos, todos em dependências de desenvolvimento (`vite`, `@vitest/mocker`, `source-map-js`), com correção em versão patch.
- `https://douglasabnovato.github.io/huntweb-swapi/` responde 404: o Pages segue desligado (#25). A swapi.dev respondeu 200.
- O README ainda fala de Yarn, Zeit Now, axios e de uma API do Heroku (#30).
- Defeito achado na leitura do código: ao voltar no navegador de uma busca para a lista completa, o campo de busca mantinha o termo antigo.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| O Playwright simula a rede com `page.route` e sobe o servidor com `webServer` | O teste de navegador roda sobre `npm run preview` (com a `base` `/huntweb-swapi/`) e a SWAPI simulada, sem depender da swapi.dev no CI | [Playwright: Mock APIs](https://playwright.dev/docs/mock), [Playwright: Web server](https://playwright.dev/docs/test-webserver) |
| O `@axe-core/playwright` roda o axe na página real do navegador | axe na lista e no detalhe, nos modos claro e escuro | [Playwright: Accessibility testing](https://playwright.dev/docs/accessibility-testing) |
| Cada página precisa de um título que diga o assunto (WCAG 2.4.2) | A aba mostra "Luke Skywalker · Huntweb SWAPI" no detalhe e o termo da busca na lista; numa SPA o título não muda sozinho | [W3C: Understanding Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html) |
| O Pages publica por workflow próprio quando a origem é "GitHub Actions" | O workflow já está pronto; o passo a passo do responsável fica no `docs/DEPLOY.md` e na #25 | [GitHub Docs: custom workflows com Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Dependências de desenvolvimento com correção (9 alertas) | Alto | Baixo | Este ciclo |
| 2 | `MVP.md` honesto: critérios 3 e 8 em "Parcial" até o teste existir | Alto | Baixo | Este ciclo |
| 3 | Teste Playwright do fluxo com axe e teclado, job `e2e` no CI | Alto | Médio | Este ciclo (#29) |
| 4 | Campo de busca acompanha a URL ao voltar | Médio | Baixo | Este ciclo |
| 5 | Título da aba por página | Médio | Baixo | Este ciclo |
| 6 | README atualizado | Médio | Baixo | Este ciclo (#30) |
| 7 | Ligar o Pages | Alto | Baixo | Responsável (#25) |
| 8 | API de reserva | Médio | Médio | Issue (#27) |
| 9 | Planetas, espécies e naves | Médio | Médio | Issue (#28) |

**Fora do escopo.** Favoritos, contas, demais recursos da SWAPI e domínio próprio.

### Engenharia

**Arquitetura.** Sem mudança: SPA Vite + React 18 + React Router 7, `basename` igual à `base` do build (`/huntweb-swapi/`), todo acesso à SWAPI em `src/lib/swapi.js`. Entra `e2e/` com o Playwright, fora do Vitest.

**Riscos.**
- O site segue fora do ar até o responsável ligar o Pages (#25).
- A swapi.dev cai de tempos em tempos; sem reserva, o app só avisa (#27).
- O job `e2e` instala o Chromium no CI e deixa o CI mais lento (minutos, não segundos).

**Qualidade.**
- Testes: Vitest (unidade e tela no jsdom) e Playwright (navegador, SWAPI simulada, axe nos modos claro e escuro, teclado).
- Acessibilidade: axe sem violações com `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`; Tab até o link do personagem e Enter; foco visível conferido.
- Segurança: `npm audit` (todas as dependências) e `npm audit --omit=dev` sem alertas; sem segredo nem dado pessoal.

**Definição de pronto.** `npm ci`, `npm test`, `npm run build` e `npm run test:e2e` passam; CI verde nos jobs `raiz` e `e2e`; `docs/MVP.md` com evidência; README com "Estado e próximos passos"; revisão independente feita.

### Plano de ação

**Este ciclo executa.**
1. Subir `vite`, `vitest` e `source-map-js` dentro da mesma versão maior.
2. Corrigir o `MVP.md` (3 e 8 em "Parcial") antes do código.
3. Teste Playwright com axe e teclado e job `e2e` no CI (#29).
4. Campo de busca que acompanha a URL e título da aba por página, com teste.
5. README reescrito para a versão atual e `docs/DEPLOY.md` revisto (#30).

**Vira issue.** #25 (responsável), #27, #28 e as novas issues abertas no fim do ciclo.
