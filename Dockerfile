FROM node:16.10.0

LABEL version="1.0"
LABEL description="Syscompiler backend image"
LABEL maintainer = ["alexdsantosv@gmail.com"]

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "lib/index.js"]
