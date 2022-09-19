# A minha imagem será baseada na versão 16 compacta (alpine) do node.
FROM node:16-alpine
# mkdir app + cd app, dentro do container.
WORKDIR /app
# Copiando os arquivos package.json e package-lock.json para dentro do diretório /app, do container.
COPY package*.json .
# Instalando de forma limpa todas as dependências do projeto, contidas no package.json.
RUN npm ci
# Copiando todos os arquivos contidos no diretório local "bizu_back", para o diretório "app", do container.
COPY . .
# Gerando o diretório dist, que acumula a API compilada.
RUN npm run build
# Execução do comando para que o servidor da API inicie.
CMD ["npm", "run", "start:prod"]
# Expondo o número da porta interna.
EXPOSE 80