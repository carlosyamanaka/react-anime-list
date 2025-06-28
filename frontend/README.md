# React Anime List

Este é um projeto em React que consome a API pública do [Jikan](https://jikan.moe/), um wrapper da MyAnimeList, para exibir uma lista de animes por gênero. A aplicação permite navegar entre gêneros, paginar resultados e utilizar uma barra de pesquisa simples. É uma aplicação SPA (Single Page Application) com foco em consumo de API e navegação com React Router.

## 🚀 Funcionalidades

- Listagem de animes por gênero
- Paginação com controle de página atual
- Alternância entre navegação lateral e barra de pesquisa
- Tratamento de erros com `react-error-boundary`

## 🛠️ Tecnologias utilizadas

- **React** (com Hooks: `useState`, `useEffect`, `useMemo`, `createContext`)
- **React Router DOM** para controle de rotas
- **Context API** para compartilhamento de estado global
- **Vite** como bundler para desenvolvimento e build
- **Font Awesome** para ícones
- **React Error Boundary** para captura de falhas

## 📦 Scripts disponíveis

```bash
npm install       # Instala as dependências
npm run dev       # Inicia o servidor de desenvolvimento (Vite)
npm run build     # Gera a versão de produção
npm run preview   # Visualiza o build localmente
