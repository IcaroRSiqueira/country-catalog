FROM node:22.12.0

# Diretório de trabalho dentro do container
WORKDIR /src

# Copia o código-fonte da aplicação para o diretório de trabalho
COPY . .

# Instala as dependências do projeto
RUN yarn install

# Builda o projeto
RUN yarn build

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
