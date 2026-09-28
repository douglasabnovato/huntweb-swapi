# Análise — Huntweb SWAPI

## 1. Especificação

Front-end que lista personagens de Star Wars a partir da SWAPI e mostra o detalhe de cada um.

| ID | Requisito | Antes | Depois |
|---|---|---|---|
| RF01 | Listar personagens paginados | ✅ | ✅ + página na URL |
| RF02 | Ver planeta natal | ❌ mostrava a URL | ✅ nome |
| RF03 | Abrir detalhe | ❌ id errado (substring fixa) | ✅ |
| RF04 | Buscar por nome | ❌ | ✅ |
| RF05 | Falha da API | ❌ carregamento infinito | ✅ mensagem + nova tentativa |

## 2. Defeitos encontrados

| # | Severidade | Defeito | Referência |
|---|---|---|---|
| D0 | Crítica | Não existia `src/index.js` (ponto de entrada do CRA): o projeto não compilava a partir do repositório | — |
| D1 | Alta | `persona.url.substring(29, 31)` gera `1/` ou corta ids de 3 dígitos → detalhe errado | — |
| D2 | Alta | Sem tratamento de erro: se a SWAPI cai (acontece), o loader gira para sempre | Nielsen #1, #9 |
| D3 | Média | `setTimeout(setLoading(true), 1000)` executa na hora (passa o resultado, não a função) | — |
| D4 | Média | Links amarelo #deff1c sobre branco (≈1,2:1); `outline: 0` global | WCAG 2.2 1.4.3, 2.4.7 |
| D5 | Média | `<Link onClick>` sem `to` para voltar; abrir o detalhe direto e voltar saía do site | — |
| D6 | Baixa | Dependências sem sentido (`and`, `global`, `netlify-cli`) e react-scripts 2.1.5 | OWASP A03:2025 |
| D7 | Baixa | JSONs locais de planetas, espécies e naves não eram usados | — |

## 3. Baseline automatizado

| Verificação | Antes | Depois |
|---|---|---|
| Testes | 0 | 4 cenários |
| `npm audit` | dezenas (CRA 2) | 0 |
| axe-core | não executável | 0 violações |

## Rubrica v2 (grupo front-end)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 17% | 4 | 7 | Chromium: lista → planeta resolvido → paginação → detalhe (SWAPI simulada; sem acesso a ela aqui) | Link do personagem quebrava para ids de 1 e 3 dígitos (substring fixa); planeta aparecia como URL. Auditoria: SWAPI real bloqueada neste ambiente; fluxo validado com API simulada, então vale o teto de 7 |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 10% | 2 | 8 | testes: erro com nova tentativa, busca vazia, 404 | Antes: sem tratamento de erro, loader eterno se a API falhasse |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 11% | 3 | 8 | axe-core 0 violações (lista, detalhe) | Links amarelos sobre branco (contraste ~1,2:1), sem rótulos; agora AA |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 10% | 6 | 7 | sem segredos; URL da API por variável | Projeto só front; logotipo Star Wars é marca registrada (uso de fã) |
| C5 | Dados | 3FN / ACID / fonte única | 3% | 4 | 7 | planets.json usado como cache local; ids por regex | Dados locais (planets/species/starships) não eram usados |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 0 | 7 | vitest 4 cenários | Não havia testes |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 8% | 4 | 8 | lib/swapi isolada; componentes pequenos | Hooks com efeitos cancelados; sem setTimeout quebrado |
| C8 | Desempenho | Complexidade; Core Web Vitals | 7% | 5 | 7 | AbortController, cache de planetas, build Vite | Sem Lighthouse |
| C9 | Operação | 12-Factor; DORA | 6% | 3 | 7 | CI em ci/, deploy estático | Sem URL publicada |
| C10 | Documentação | README como contrato | 5% | 5 | 7 | README + docs/ | Readme original preservado |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 8% | 4 | 7 | busca e detalhe mais completos | Página e busca na URL, voltar mantém a posição |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 6% | 1 | 8 | npm audit 0; removidos pacotes estranhos (and, global, netlify-cli) | react-scripts 2.1.5 e axios 0.18 vulneráveis |

**Média ponderada:** antes **3,41** (REPROVADO) → depois **7,35** (APROVADO).

## Limitações da avaliação

- A SWAPI não é acessível deste ambiente; o fluxo foi exercitado no Chromium com respostas simuladas no formato real.
- O logotipo "Star Wars" é marca da Lucasfilm; ok para projeto de estudo, mas evite em uso comercial.
