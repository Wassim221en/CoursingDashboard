FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY src/libs/ckeditor5 ./src/libs/ckeditor5

RUN corepack enable && yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 4173

CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "4173"]
