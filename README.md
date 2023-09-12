# User e Courses + Permissão de Administrador


Neste projeto o objetivo foi criar um MVP (Minimum Viable Product) de uma API que faz o controle de usuários e cursos em que esses usuários serão matriculados. Essa API também precisa ter um controle de acessos, onde alguns recursos podem ser acessados apenas por usuários que fizeram login na aplicação, e outros recursos apenas usuários que fizeram login e tem permissões de administrador podem acessar.

tecnologias: TypeScript, Express, NodeJs, PostgreSQL, PG para conexão com banco de dados, Serialização de dados com Zod, criptografia de senhas com Bcryptjs e autenticação e autorização com jsonwebtoken.


## **Tabelas do banco de dados**

### **Tabela users**

- Nome da tabela: **_users_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 50 e obrigatório.
  - **email**: string, tamanho 50, obrigatório e único.
  - **password**: string, tamanho 120 e obrigatório.
  - **admin**: booleano, obrigatório e **DEFAULT** igual a **false**.

### **Tabela courses**

- Nome da tabela: **_courses_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 15 e obrigatório.
  - **description**: texto e obrigatório.

### **Tabela userCourses**

- Nome da tabela: **_userCourses_**.
- Representa a tabela intermediária que fará a relação N:N entre **users** e **courses**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **active**: booleano, obrigatório e **DEFAULT** igual a **true**.
  - **userId**: inteiro, obrigatório e chave estrangeira.
  - **courseId**: inteiro, obrigatório e chave estrangeira.

## **Relacionamentos**

### **users e courses**

- Um usuário pode se matricular em vários cursos e um curso pode ter vários usuários matriculados a ele.
- Caso um **_course_** seja deletado, todas as relações com **_users_** devem ser **deletadas** automaticamente da tabela intermediária.
- Caso um **_user_** seja deletado, todas as relações com **_courses_** devem ser **deletadas** automaticamente da tabela intermediária.

## **Rotas - /users e /login**

## Endpoints

| Método | Endpoint           | Responsabilidade                              |
| ------ | ------------------ | --------------------------------------------- |
| POST   | /users             | Cadastrar um novo usuário                     |
| POST   | /login             | Criar o token de autenticação para um usuário |
| GET    | /users             | Listar todos os usuários                      |
| GET    | /users/:id/courses | Listar todos os cursos de um usuário          |

#

## Regras da aplicação

### **POST /users**

- Deve ser possível criar um usuário enviando o seguinte através do corpo da requisição;
  - **name**: string, campo obrigatório.
  - **email**: string, campo obrigatório.
  - **password**: string, campo obrigatório
  - **admin**: booleano, opcional.
- A password deve ser armazenada no banco em formato de hash.
- Não deve ser possível cadastrar um developer enviando um email já cadastrado no banco de dados.
- Deve ser feita a serialização de dados de entrada e saída usando o zod.

  - Todos os campos obrigatórios devem estar no body da requisição.
  - O email deve ser um email válido.
  - O campo de **password** NÃO deve ser retornado na resposta.

- **Sucesso**:
  - Retorno esperado: um objeto contendo os dados do usuário cadastrado, com excessão do hash da password.
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso o email já cadastrado no banco:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

  - Caso a validação do zod dê erro:
    - Retorno esperado: um objeto contendo as chaves dos campos com erro e a mensagem adequada de cada erro;
    - Status esperado: _400 BAD REQUEST_.

### **POST /login**

- Deve ser possível criar um token jwt enviando o seguinte através do corpo da requisição:

  - **email**: string, campo obrigatório.
  - **password**: string, campo obrigatório

- Deve ser feita a serialização de dados de entrada usando o zod.

  - Todos os campos obrigatórios devem estar no body da requisição.

- **Sucesso**:
  - Retorno esperado: um objeto contendo o token jwt.
  - Status esperado: _20 OK_
- **Falha**:

  - Caso o email não exista ou a senha esteja incorreta:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso a validação do zod dê erro:
    - Retorno esperado: um objeto contendo as chaves dos campos com erro e a mensagem adequada de cada erro;
    - Status esperado: _400 BAD REQUEST_.

### **GET /users**

- Deve listar todos os usuários.
- O retorno da resposta não deve conter o hash da password.
- É necessário enviar o **Bearer token** no Header dessa requisição.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um array contendo os objetos de todos os usuários;
  - Status esperado: _200 OK_;
- **Falha**:

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

### **GET - /users/:id/courses**

- Deve ser possível listar todos os cursos de um usuário.
- É necessário enviar o **Bearer token** no Header dessa requisição.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um array contendo os objetos de todos os cursos vinculados ao usuário logado, juntamente com os dados do usuário;
  - Status esperado: _200 OK_;
    - Use o _alias_ nas colunas do SELECT para retornar os campos de acordo com os nomes mostrados no JSON de exemplo.
- **Falha**:

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o usuário não esteja matriculado em nenhum curso:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _404 NOT FOUND_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _403 FORBIDDEN_.

- **Exemplos de retornos**:

- Listando cursos do usuário logado com sucesso:

  | Resposta do servidor: |
  | --------------------- |
  | Body: Formato Json    |
  | Status code: _200 OK_ |
  |                       |

  ```json
  [
    {
      "couseId": 1,
      "courseName": "Frontend",
      "courseDescription": "HTML, CSS e JavaScript",
      "userActiveInCourse": true,
      "userId": 1,
      "userName": "Ugo"
    },
    {
      "couseId": 2,
      "courseName": "React",
      "courseDescription": "Biblioteca React para construção de frontend",
      "userActiveInCourse": false,
      "userId": 1,
      "userName": "Ugo"
    }
  ]
  ```

- Caso o token não seja enviado:

  | Resposta do servidor:           |
  | ------------------------------- |
  | Body: Formato Json              |
  | Status code: _401 UNAUTHORIZED_ |

  ```json
  {
    "message": "Missing bearer token"
  }
  ```

## **Rota - /courses**

## Endpoints

| Método | Endpoint                         | Responsabilidade                                  |
| ------ | -------------------------------- | ------------------------------------------------- |
| POST   | /courses                         | Cadastrar um novo curso                           |
| GET    | /courses                         | Listar todos os cursos                            |
| POST   | /courses/:courseId/users/:userId | Matricular o usuário em um curso                  |
| DELETE | /courses/:courseId/users/:userId | Setar matrícula para false do usuário em um curso |
| GET    | /courses/:id/users               | Listar todos os usuários matriculados em um curso |

### **POST /courses**

- Deve ser possível criar um curso enviando o seguinte através do corpo da requisição:
  - **name**: string, campo obrigatório.
  - **description**: string, campo obrigatório.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.
- Deve ser feita a serialização de dados de entrada e saída usando o zod:

  - Todos os campos obrigatórios devem estar no body da requisição.

- **Sucesso**:
  - Retorno esperado: um objeto contendo os dados do curso cadastrado.
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso a validação do zod dê erro:

    - Retorno esperado: um objeto contendo as chaves dos campos com erro e a mensagem adequada de cada erro;
    - Status esperado: _400 BAD REQUEST_.

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

### **GET /courses**

- Deve listar todos os cursos.

- **Sucesso**:

  - Retorno esperado: um array contendo os objetos de todos os cursos;
  - Status esperado: _200 OK_;

### **POST /courses/:courseId/users/:userId**

- Deve ser possível matricular o usuário em um curso, enviando o id do curso e o id do user no parâmetro de rota:
  - Essa rota irá usar a tabela intermediária _userCourses_ para vincular o usuário ao curso que ele será matriculado.
  - O campo active deve ser colocado com **true**
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso o course ou o user não existam:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

### **DELETE /courses/:courseId/users/:userId**

- Deve ser possível inativar a matricula de um usuário em um curso, enviando o id do curso e o id do user no parâmetro de rota:
  - Essa rota irá atualizar o valor do campo **active** da tabela intermediária _userCourses_ para **false**.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: não deve retornar nenhum dado;
  - Status esperado: _204 NO BODY_
- **Falha**:

  - Caso o course ou o user não existam:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.


### **GET - /courses/:id/users**

- Deve ser possível listar todos os usuários vinculados a um curso.
- É necessário enviar o **Bearer token** no Header dessa requisição.
- Apenas usuários logados e que são admin devem tem permissão de acessar essa rota.

- **Sucesso**:
  - Retorno esperado: um array contendo os objetos de todos os usuários vinculados a um curso, juntamente com os dados do curso
  - Status esperado: _200 OK_;
    - Use o _alias_ nas colunas do SELECT para retornar os campos de acordo com os nomes mostrados no JSON de exemplo.
- **Falha**:

  - Caso o token não seja enviado:

    - Retorno esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja inválido:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.

  - Caso o token seja de um usuário cujo **admin** é false:

    - Retorno esperado: um objeto contendo a chave **_message_** com a mensagem de erro retornada pelo lib do jwt;
    - Status esperado: _401 UNAUTHORIZED_.


