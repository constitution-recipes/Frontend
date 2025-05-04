FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NEXT_PUBLIC_API_URL=http://constitution-recipe.shop/api
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]