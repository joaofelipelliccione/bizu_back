# A minha imagem será baseada na versão 16 compacta (alpine) do node.
FROM node:16-alpine
# mkdir app + cd app, dentro do container.
WORKDIR /app
# Copiando os arquivos package.json e package-lock.json para dentro do diretório /app, do container.
COPY package*.json ./
# Instalando de forma limpa todas as dependências do projeto, contidas no package.json.
RUN npm ci
# Copiando todos os arquivos contidos no diretório local "bizu_back", para o diretório "app", do container.
COPY . .
# Execução do comando para que o servidor da API inicie. ALTERAR ENTRE DEV/PROD!
# CMD ["npm", "run", "start:dev"]
CMD ["npm", "run", "start:prod"]
# Definindo o número da porta interna do container.
EXPOSE 3001