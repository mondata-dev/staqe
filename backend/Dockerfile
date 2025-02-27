# use node 20 alpine image as build image
FROM node:23-alpine@sha256:15ef2444da8aee1ad420b92323fc2e8c8086b7bca7498d48d6ae0d0369d3039d

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
