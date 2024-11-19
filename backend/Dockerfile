# use node 20 alpine image as build image
FROM node:23-alpine@sha256:ecefaffd4706c5879af52e022fdb8ea30cbd6590e2a30d05347790d690727c6c

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
