
# Customer Management

Esse projeto é um BOT do discord de gestão de prisões para um servidor de FiveM, desenvolvido em Node.JS

## Índice

- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Dependências](#dependências)
- [Licença](#licença)

## Instalação

Para começar a usar o BOT, siga os passos abaixo:

1. Tenha instalado em sua maquina a versão do node `24` ou superior
2. Na raiz do projeto instale as dependências com o comando:
  ```bash
  npm install
  ```
3. Após finalizar a instalação, inicie a aplicação com o comando:
  ```bash
  npm start
  ```

## Scripts Disponíveis

No diretório do projeto, você pode executar os seguintes scripts:

1. Inicia a aplicação `Node.JS`.
  ```bash
  npm run start
  ```
2. Inicia a aplicação `Node.JS` em modo de desenvolvimento.
  ```bash
  npm run dev
  ```

## Dependências

### Produção

- **discord.js**: Biblioteca oficial da plataforma Discord.
- **dotenv-safe**: Gerencia as variáveis do arquivo `.env`.


### Desenvolvimento

- **eslint**: Ferramenta de linting para JavaScript.
- **nodemon**: Reinicia automaticamente o servidor Node.js sempre que arquivos do projeto são alterados.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.