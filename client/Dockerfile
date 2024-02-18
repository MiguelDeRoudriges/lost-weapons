FROM node:18

WORKDIR /frontend
COPY ./ /frontend
RUN npm install --legacy-peer-deps
RUN npm run build

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD [ "npm run start" ]