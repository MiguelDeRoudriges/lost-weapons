FROM node:18

ENV BASE_URL="http://backend:3000"
ENV PORT=3000
ENV DB_URL="mongodb://mongodb:27017/registry"

WORKDIR /backend
COPY ./ /backend
RUN npm install

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD [ "npm run dev" ]