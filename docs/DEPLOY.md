# Deploy · Huntweb SWAPI

Plano de ação para publicar a lista de personagens de Star Wars em hospedagem gratuita.

## 1. Desafio

Publicar uma SPA em Vite + React com rotas no cliente (`/` e `/people/:id`) que consome a SWAPI pública direto do navegador, sem servidor próprio, com deploy automático e sem custo, e com um plano B caso a SWAPI saia do ar.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **GitHub Pages publicado pelo GitHub Actions (escolhida)** | Gratuito, no mesmo lugar do código; o workflow que já testa e gera o build passa a publicar a `master` |
| Netlify (usado antes, pasta `.netlify` ignorada) | Funcionaria, mas exige outra conta e outro painel |
| Render Static Site | Funcionaria, mas não há backend que justifique mais um serviço |

URL esperada: **https://douglasabnovato.github.io/huntweb-swapi/**

### O que foi ajustado

| Arquivo | Ajuste | Por quê |
|---|---|---|
| `vite.config.js` | `base: '/huntweb-swapi/'` no build e no preview (raiz no `npm run dev` e nos testes) e um plugin que copia `build/index.html` para `build/404.html` | No Pages o site fica em `/huntweb-swapi/`; o `404.html` faz o Pages entregar o app quando alguém abre `/huntweb-swapi/people/1` direto ou dá F5 no detalhe |
| `src/main.jsx` | `BrowserRouter basename={import.meta.env.BASE_URL}` | As rotas passam a valer dentro de `/huntweb-swapi/` |
| `ci/github-actions-ci.yml` | Node 22; o build lê a variável de repositório `VITE_SWAPI_URL` (opcional); job `web` gera o artefato e novo job `deploy` publica (só em push na `master`) | Node 20 saiu de suporte em abr/2026; publicação automática; troca de API sem mexer no código |
| `.env.example` e `README.md` | Aviso de que outra API só serve se tiver o mesmo formato da swapi.dev; seção "Em produção" | O README sugeria `swapi.info` como troca direta, o que não é garantido (ver abaixo) |

Validação feita antes da entrega (sandbox, Node 22):

- `npm ci` limpo; `npm test`: **4 testes passando**; `npm run build` gera `build/` com `404.html`.
- `npm audit --omit=dev` e `npm audit`: **0 vulnerabilidades** (antes e depois).
- Servidor que imita o Pages (entrega `404.html` para caminhos inexistentes) aberto no Chromium com Playwright: a lista carrega, o planeta natal aparece ("Tatooine", do JSON local), o clique em "Acessar" leva para `/huntweb-swapi/people/1` e abrir esse endereço direto funciona, sem erros de script. A SWAPI foi simulada nesse teste (a sandbox não tem acesso a ela).

### A SWAPI (URL base)

- O app usa `https://swapi.dev/api` (HTTPS, sem chave), a menos que `VITE_SWAPI_URL` diga outra coisa.
- A swapi.dev teve o certificado HTTPS vencido várias vezes (issue [phalt/swapi#149](https://github.com/phalt/swapi/issues/149), com relatos até 2025). Com certificado vencido, o navegador bloqueia as chamadas e o app mostra "Não foi possível falar com a SWAPI".
- Daqui não consegui chamar nenhuma SWAPI para testar. **Não troquei a URL**: as alternativas conhecidas não têm o mesmo formato. O app precisa de lista paginada (`count`, `next`, `previous`, `results`, 10 por página) e busca com `?search=`. A `swapi.info` devolve listas completas, sem paginação nem busca, e a `swapi.tech` usa outro formato (`uid`, busca por `?name=`, detalhe em `result.properties`). Trocar para qualquer uma delas exige mudar `src/lib/swapi.js` e as páginas.

### Limitações do plano gratuito

- GitHub Pages: site público, até 1 GB, cerca de 100 GB de banda por mês; o repositório precisa ser público no plano gratuito.
- Deep link (`/huntweb-swapi/people/1`) funciona pelo `404.html`: a página abre normalmente, mas o servidor responde com status 404 nesse primeiro carregamento (efeito conhecido do Pages).
- A disponibilidade depende da SWAPI, que é um serviço comunitário sem garantia.

### Segurança e LGPD

- Não há segredo nem dado pessoal: o app só lê dados públicos da SWAPI. `VITE_SWAPI_URL` é uma URL pública, por isso fica em **Variables** e não em Secrets.

### Decisões pendentes (para você validar)

1. **SWAPI fora do ar**: se na Etapa 4 a lista não carregar por certificado vencido na swapi.dev, as opções são (a) esperar a swapi.dev voltar; (b) me pedir a adaptação do `src/lib/swapi.js` para a `swapi.tech` (paginada, formato diferente); (c) apontar `VITE_SWAPI_URL` para uma cópia própria da SWAPI com o mesmo formato. Com uma API compatível, basta criar a variável (Etapa 2.3) e rodar o workflow de novo, sem mudar o código.

## 3. Solução (passo a passo)

### Etapa 1 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/huntweb-swapi`
2. `npm ci` (se reclamar do lockfile, `npm install` e depois `npm ci` de novo)
3. `npm test` (4 testes)
4. `npm run build` (confira que `build/404.html` foi gerado)
5. `npm run preview` e abrir `http://localhost:4173/huntweb-swapi/`: a lista precisa carregar. Se aparecer "Não foi possível falar com a SWAPI", abra `https://swapi.dev/api/people/1/` no navegador: se ele avisar que o certificado venceu, veja "Decisões pendentes".

### Etapa 2 · Ligar o GitHub Pages (antes do push)

1. No repositório `huntweb-swapi` no GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Confira em **Settings → Environments → github-pages** que a branch `master` pode publicar (por padrão, a branch padrão do repositório já pode).
3. Opcional (só se for trocar a API por uma compatível): **Settings → Secrets and variables → Actions → aba Variables → New repository variable**: `VITE_SWAPI_URL` = URL base sem barra final. Sem essa variável, o app usa `https://swapi.dev/api`.

### Etapa 3 · Subir para o GitHub

1. Remover os arquivos substituídos:
   ```bash
   git rm public/index.html src/App.js src/routes.js src/services/api.js src/components/Header/index.js src/components/Loader/index.js src/pages/main/index.js src/pages/persona/index.js
   ```
2. Mover o workflow:
   ```bash
   mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci
   ```
3. `git status` (nenhum `build/`, `.env` ou `node_modules/` pode aparecer)
4. `git add -A`
5. `git commit -m "chore: deploy no GitHub Pages (base /huntweb-swapi/, 404.html, workflow com publicação)"`
6. `git push origin master`
7. Aba **Actions**: o workflow "CI" precisa ficar verde nos jobs `web` e `deploy`.

### Etapa 4 · Conferir no ar

1. Abrir https://douglasabnovato.github.io/huntweb-swapi/: cabeçalho com o logo, favicon e a lista de personagens com planeta natal e ano de nascimento.
2. Buscar "Luke" e usar "Próximo"/"Anterior" na lista completa.
3. Clicar em "Acessar" num personagem: a URL vira `/huntweb-swapi/people/<id>`. Dar F5: o detalhe continua.
4. Abrir `https://douglasabnovato.github.io/huntweb-swapi/xyz`: aparece "Página não encontrada" com link para a lista.
5. DevTools (F12) → Console: nenhum erro de certificado ou CORS vindo de `swapi.dev`.

### Etapa 5 · Fechar

1. No GitHub, **About → Website**: colar `https://douglasabnovato.github.io/huntweb-swapi/`.
