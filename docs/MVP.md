# MVP — huntweb-swapi

> Criado em 02/11/2026. Revisto em 03/11/2026, no ciclo do processo por repositório. Este arquivo é a fonte única do estado. Testado no Windows, com Node 24. Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta: 10 critérios.

**Resultado em 03/11/2026:** 9 de 10 critérios aplicáveis atendidos (1, 2, 3, 4, 6, 8, 9, 11, 12); 1 parcial (10). O resumo anterior dizia 9 de 12 e marcava o critério 10 como "Atende" com a principal sem proteção.

**Finalizado: sim.** Pela regra do ciclo, o critério que falta depende do responsável e tem issue aberta com o rótulo `depende-do-responsavel`: 10 (#26). A publicação no Pages (#25) também é do responsável.

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem estuda React consulta personagens de Star Wars numa lista com busca e detalhe | `docs/PLANO-DE-ACAO.md` | 03/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção 2; ainda sem validação com pessoas | Seção 2 | 03/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: lista, busca, paginação e detalhe passam nos testes; a swapi.dev respondeu 200 em 03/11; o site não está no ar (#25) | `src/__tests__/app.test.jsx` | 03/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 | 03/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — | 03/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: busca vazia, rede caída, SWAPI fora do ar, tempo esgotado (15 s) e personagem inexistente têm mensagem; lista e detalhe têm "Tentar de novo"; tudo com teste | `app.test.jsx` (9 testes) | 03/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1) | — | 03/11/2026 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe sem violações em 2 telas e foco visível (02/11); botões novos com nome; "Filmes" como título de seção | `src/pages/persona/index.jsx` | 03/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Atende: sem segredo nem dado pessoal; `npm audit --omit=dev` sem alertas; varredura de segredos sem achado | `git grep` do guia de estado | 03/11/2026 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Parcial: CI em PRs para `master` e `developer/**`; `master` sem proteção | #26 | 03/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 9 testes no Vitest rodam no CI | CI do PR do ciclo | 03/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar, e os números estão certos | Atende: README e este resumo revistos; o README diz que o site está fora do ar. A limpeza das ferramentas antigas segue na #30 | `README.md`, este arquivo | 03/11/2026 |

## 2. Hipótese (proposta)

Praticar consumo de API e rotas: uma pessoa acha um personagem pela busca em até 3 passos.

## 3. Fora do MVP

Favoritos, contas e demais recursos da SWAPI.

## 4. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Falha da SWAPI testada, limite de tempo e "Tentar de novo" no detalhe | Feito (#24) |
| 2 | Filmes do personagem no detalhe | Feito (#24) |
| 3 | CI nos PRs para a `developer` | Feito neste ciclo |
| 4 | Ligar o Pages | Com o responsável (#25) |
| 5 | Proteger a `master` | Com o responsável (#26) |
| 6 | API de reserva | Issue (#27) |
