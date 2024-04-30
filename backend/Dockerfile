# use node 20 alpine image as build image
FROM node:22-alpine@sha256:9459e243f620fff19380c51497493e91db1454f5a30847efe5bc5e50920748d5

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
