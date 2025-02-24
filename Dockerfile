FROM node:22.12.0

# Diretório de trabalho dentro do container
WORKDIR /src

# Copia o código-fonte da aplicação para o diretório de trabalho
COPY package.json .
COPY package-lock.json .

# Instala as dependências do projeto
RUN npm install

# Comando para iniciar a aplicação
CMD ["npm", "start"]
