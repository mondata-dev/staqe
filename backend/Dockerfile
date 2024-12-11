# use node 20 alpine image as build image
FROM node:23-alpine@sha256:f42ff22775892b0e2c81a1c64adeb58bfe5029090b388d1c2211fc8d0d045666

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
