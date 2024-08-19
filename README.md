<p align="center">
  <img alt="TaskLogo" title="TaskMaster" src=".github/logo-no-background.png" width="200px" />
</p>
<h3 align = "center" fontSize="60px">
  Task Management App aplicativo fullstack de gerenciamento de tarefas
</h3>

<p align="center">
  <img alt="Interface da aplicação" src=".github/frontend-dashboard-v3.png" width="100%">
  <img alt="Interface da aplicação" src=".github/frontend-dashboard-v3.png" width="100%">
  <img alt="Interface da aplicação" src=".github/frontend-dashboard-v3.png" width="100%">
  <h3 align = "center" fontSize="60px">
  Versão Previa(Em desenvolvimento)
  </h3>
</p>

# Task Management App

## 💻 Descrição

Este aplicativo fullstack de gerenciamento de tarefas é uma demonstração do meu progresso na aplicação de tecnologias modernas de desenvolvimento web. No desenvolvimento deste projeto, estou explorando e aprimorando minhas habilidades nas seguintes áreas:

- React.js: Utilizado para criar uma interface de usuário dinâmica e responsiva, com o objetivo de melhorar a experiência do usuário e a interação com a aplicação.
- NestJS: Implementado para construir uma API de back-end robusta e escalável, proporcionando uma base sólida para a manipulação de dados e lógica de negócios.
- PostgreSQL: Escolhido para o armazenamento de dados, com o intuito de garantir eficiência e confiabilidade no gerenciamento e recuperação de informações.
- Docker: Utilizado para conteinerização, facilitando a implantação contínua e a gestão de ambientes de desenvolvimento e produção.

Estou constantemente aprendendo e aplicando novas técnicas e boas práticas para otimizar a performance e a escalabilidade do aplicativo. Este projeto não apenas me permite explorar novas tecnologias, mas também me desafia a resolver problemas complexos e a melhorar minhas habilidades de desenvolvimento.

## 📊 Progresso do Projeto

### Progresso Total

![Progresso Total](https://geps.dev/progress/70)

- **Progresso Total**: 70% concluído
- **Descrição**:

1. Implementação inicial concluída, estrutura básica do projeto configurada.
2. Configurações basicas frontend e backend finalizadas.
3. Implementação de funcionalidades básicas concluída.
4. Frontend Pagina Home Completa
5. Backend Endpoints em funcionamento.
6. Implementação de funcionalidades básicas, como CRUD de tarefas e autenticação de usuários
7. Configuração do banco de dados PostgreSQL com Docker.
8. Criação da estrutura básica do frontend com React.js e Material-UI

### Frontend

![Progresso Frontend](https://geps.dev/progress/80)

- **Frontend**: 80% concluído
- **Descrição**:

1. Estrutura do frontend configurada, começando a implementação dos componentes principais
2. Criação das telas de login,cadastro e tela do dashboard com o kanban inicial
3. Criação das telas de login, cadastro e homepage com React.js e Material-UI
4. Implementação do kanban inicial do dashboard com React.js e Material-UI
5. Desenvolvimento de componentes principais, como header e footer

### Backend

![Progresso Backend](https://geps.dev/progress/90)

- **Backend**: 90% concluído
- **Descrição**:

1. Estrutura básica do backend configurada, início da implementação da API e integração com o banco de dados.
2. Configurado o JWT criando componentes referentes a autenticação do login e cadastro de usuario nas fases iniciais através do token.
3. Finalizado CRUD basico dos usuarios,tarefas,colunas e projetos com seus devidos endpoints.
4. Implementação da API com NestJS e TypeORM
5. Criação de endpoints para CRUD de tarefas e autenticação de usuários
6. Configuração completa do JWT para autenticação segura
7. Implementação de validação de objetos e propriedades com Class-Validator e Class-Transformer

---

### Próximos Passos

- **Frontend**:
  - Ajustar a lógica de negócios para o kanban
  - Ajustar a lógica de negócios para o CRUD de tarefas
  - Ajustar Kanban e Refatorar adicionando logicas de mudança de coluna e visão de usuarios que estão no projeto
- **Backend**:

  - Ajustar a lógica de negócios para o CRUD de tarefas
  - Ajustar a lógica de negócios para o CRUD de usuários
  - Ajustar a lógica de negócios para o CRUD de projetos
  - Refatorar Backend para funcionamento de autenticação de usuarios por projeto

- **Progresso Total**:
  - Refinar a estrutura do projeto.
  - Realizar testes e ajustes conforme necessário.

## 🎨 Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Material-UI**: Biblioteca de componentes React para um design moderno e responsivo.
- **Axios**: Cliente HTTP para fazer requisições à API.

### Backend

- **NestJS**: Framework Node.js para construção de aplicações server-side escaláveis.
- **TypeORM**: ORM para TypeScript e JavaScript (ES7, ES6, ES5).
- **JWT**: Mecanismo para autenticação segura usando tokens JSON Web.
- **Class-Validator**: Biblioteca para validação de objetos e propriedades.
- **Class-Transformer**: Biblioteca para transformar objetos em classes e vice-versa.

### Banco de Dados

- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional poderoso e open-source.

### DevOps

- **Docker**: Plataforma para desenvolvimento, envio e execução de aplicações em containers.
- **Docker Compose**: Ferramenta para definir e gerenciar multi-containers Docker.
- **Adminer**: Ferramenta de gerenciamento de banco de dados com uma interface de usuário amigável.

### Design e Modelagem

- **dbDesigner**: Ferramenta online para modelagem de banco de dados ER.
- **Figma**: Ferramenta para design de interface e prototipagem colaborativa.

## Funcionalidades

- [ ] Autenticação e autorização de usuários na manipulação das tarefas de projetos
- [x] CRUD de tarefas
- [x] Gestão de projetos

## Estrutura do Projeto

- backend/: API NestJS
- frontend/: Aplicação React.js
- database/: Configuração do PostgreSQL

## Como Executar o Projeto

### Pré-requisitos

- Docker
- Docker Compose

### Passos para Clonar e Configurar

```bash
git clone https://github.com/Sub-Dev/task-management-app.git
cd task-management-app
```

### Instruções para Executar com Docker

```bash
docker-compose up --build
```

## Acessar o Adminer

Depois que o Docker Compose estiver em execução, você pode acessar o Adminer para gerenciar seu banco de dados PostgreSQL navegando até:

```bash
http://localhost:8080
```

## Endpoints da API

A API estará disponível em:

```bash
http://localhost:4000
```

## Aplicação Frontend

A aplicação frontend estará disponível em:

```bash
http://localhost:3000
```

## 👥 Autor

<table>
 <tr>
 <td alinhar="centro">
 <a href="https://github.com/Sub-Dev" target="_blank">
 <img src="https://avatars.githubusercontent.com/u/68450692?v=4" alt="Anthony-Marin" height="30" width="30"/>
 </a>
 </td>
 <td>
 <strong>Anthony Marin</strong> (Sub-Dev) - <a href="https://github.com/Sub-Dev">Perfil no GitHub</a>
 </td>
 </tr>
</table>

## Mais Imagens do Projeto

<p align="center">
  <img alt="Interface Signin" src=".github/frontend-signin-v1.png" width="100%">  
  <img alt="Interface Signup" src=".github/frontend-signup-v1.png" width="100%">
  <img alt="Interface Dashboard" src=".github/frontend-dashboard-v3.png" width="100%">
  <img alt="Interface Projetos" src=".github/frontend-projects-v2.png" width="100%">
  <img alt="Interface Kanban" src=".github/frontend-kanban-v3.png" width="100%">
  
  frontend-kanban-v3.png
</p>

## Licença

Este projeto está licenciado sob a Licença MIT.
