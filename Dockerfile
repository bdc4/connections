FROM node:18-alpine

WORKDIR /srv/connections/connections

COPY package*.json ./
RUN npm ci

COPY . .

# Ensure build completes and output exists
RUN npm run build && test -f dist/index.html

EXPOSE 3002

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3002"]