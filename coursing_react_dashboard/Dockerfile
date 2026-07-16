FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY src/libs/ckeditor5 ./src/libs/ckeditor5

RUN corepack enable && yarn install --frozen-lockfile

COPY . .

RUN yarn dev 

EXPOSE 4173

CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "4173"]
