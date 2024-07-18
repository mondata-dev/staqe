# use node 20 alpine image as build image
FROM node:22-alpine@sha256:f200d5ce9f0c43df6f3a6b97b692f998cce270f1409864de5fbb2e61836121f2

# create work directory in app folder
WORKDIR /app

# copy over package.json files
COPY package.json /app/
COPY package-lock.json /app/

# install all depencies
RUN npm i

# copy over all files to the work directory
ADD . /app

RUN npm run build

# expose the host and port 3300 to the server
ENV HOST 0.0.0.0
EXPOSE 3300

# run the build project with node
ENTRYPOINT ["node", "dist/index.js"]
