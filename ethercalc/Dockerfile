FROM node:18-alpine

RUN npm install -g ethercalc

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "ethercalc --port ${PORT}"]
