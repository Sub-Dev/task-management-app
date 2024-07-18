# Task Management App

## Descrição
Aplicação de gerenciamento de tarefas fullstack, utilizando React.js no frontend, NestJS para a API no backend, PostgreSQL para o banco de dados e Docker para conteinerização.

## Tecnologias Utilizadas

### Frontend
- **React.js**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Material-UI**: Biblioteca de componentes React para um design moderno e responsivo.
- **Axios**: Cliente HTTP para fazer requisições à API.

### Backend
- **NestJS**: Framework Node.js para construção de aplicações server-side escaláveis.
- **TypeORM**: ORM para TypeScript e JavaScript (ES7, ES6, ES5).
- **JWT**: Mecanismo para autenticação segura usando tokens JSON Web.

### Banco de Dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional poderoso e open-source.

### DevOps
- **Docker**: Plataforma para desenvolvimento, envio e execução de aplicações em containers.
- **Docker Compose**: Ferramenta para definir e gerenciar multi-containers Docker.

### Design e Modelagem
- **dbDesigner**: Ferramenta online para modelagem de banco de dados ER.
- **Figma**: Ferramenta para design de interface e prototipagem colaborativa.

## Funcionalidades
- [ ] Autenticação e autorização de usuários
- [ ] CRUD de tarefas
- [ ] Gestão de projetos

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
git clone https://github.com/usuario/task-management-app.git
cd task-management-app
```
### Instruções para Executar com Docker
```bash
docker-compose up --build
```
## Licença
Este projeto está licenciado sob a Licença MIT.
