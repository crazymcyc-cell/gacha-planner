# 🌟 GachaPlanner Pro

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)

Uma calculadora de recursos inteligente e interativa (Single-Page Application) projetada para ajudar jogadores de **Honkai: Star Rail** (e outros jogos Gacha) a planejarem seus gastos e acúmulos a longo prazo.

🔗 **[Acesse o projeto online aqui](https://gacha-planner-henna.vercel.app/)**

---

## 🎯 Sobre o Projeto

O GachaPlanner Pro resolve um problema comum: _terei recursos suficientes para garantir aquele personagem no próximo patch?_

A aplicação recebe os recursos atuais do usuário, o tempo até o banner desejado e as assinaturas ativas, projetando instantaneamente o saldo final de **Stellar Jades** e **Pulls**. Além disso, fornece uma análise visual das suas chances reais e permite manter um histórico dos seus resultados em banners anteriores.

## ✨ Funcionalidades

- **Cálculo de Projeção:** Estima o ganho de Stellar Jades ao longo de "X" dias.
- **Integração de Assinaturas:** Inclui ganhos do _Supply Pass_ (Passe Mensal) e do Passe de Batalha automaticamente.
- **Análise Visual de Probabilidade (%):** Informa ao usuário suas chances estimadas de 0% a 100% de obter o personagem promocional, acompanhada de uma barra de progresso animada baseada nos cálculos de Hard Pity, Soft Pity e 50/50.
- **Histórico de Pity Local:** Registre e gerencie os personagens obtidos, número de pulls gastos e o resultado do 50/50. Tudo é salvo automaticamente no seu navegador (`localStorage`).
- **Interface Responsiva:** Design limpo e moderno que se adapta a celulares e desktops, com feedback visual imediato.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **[React](https://reactjs.org/)** (com Hooks `useState` e `useEffect` para gerenciamento de estado e cache)
- **[Vite](https://vitejs.dev/)** (como bundler rápido)
- **[Tailwind CSS](https://tailwindcss.com/)** (versão 3, para estilização utilitária e responsiva)
- **[Lucide React](https://lucide.dev/)** (para iconografia consistente)

## 💻 Como rodar o projeto localmente

Se você deseja clonar e rodar este projeto na sua própria máquina, siga os passos abaixo:

**Pré-requisitos:**

- [Node.js](https://nodejs.org/en/) instalado (versão LTS recomendada).
- Git instalado.

**Passo a passo:**

1. Clone este repositório:

   ```bash
   git clone https://github.com/crazymcyc-cell/gacha-planner.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd gacha-planner-honkai
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. O terminal exibirá um link local (geralmente `http://localhost:5173`). Abra-o no seu navegador para ver a aplicação funcionando!

---
