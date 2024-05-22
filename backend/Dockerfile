# use node 20 alpine image as build image
FROM node:22-alpine@sha256:94567107148ac59f1eb2ad9b7c1db03f1a1a12d28717b29eda0535aa3bd2f71e

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
