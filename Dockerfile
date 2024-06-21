# use node 20 alpine image as build image
FROM node:22.3.0-alpine3.19@sha256:8d7348d334454cbd2a9336195a041445dcc63e8b7e54c049de805dc61eba2e6b as build

# create work directory in app folder
WORKDIR /app

ENV NODE_ENV production

# copy over package.json files
COPY package.json /app/
COPY package-lock.json /app/

# install all depencies
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# copy over all files to the work directory
ADD . /app

# make the postbuild.sh executable
RUN chmod +x /app/postbuild.sh

# In the first build there sometimes is a problem with the
# stq-card-header-large-font; however this problem typically
# disappears in the second build
RUN npm run build || npm run build

#---------------------------------------------
FROM node:22.3.0-alpine3.19@sha256:8d7348d334454cbd2a9336195a041445dcc63e8b7e54c049de805dc61eba2e6b as run

WORKDIR /app

COPY --from=build /app/.output /app

# expose the host and port 3000 to the server
ENV HOST 0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", "server/index.mjs"]
