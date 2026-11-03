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
