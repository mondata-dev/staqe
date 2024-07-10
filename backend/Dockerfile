# use node 20 alpine image as build image
FROM node:22-alpine@sha256:ba898e86c2cc720c8cf2ae05f8d2d4697fe0c8ca3e920d6fbf14a6cbf50bb9ca

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
