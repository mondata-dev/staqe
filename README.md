# Staqe Nuxt Frontend

Frontend project for the Nimiq Staking as a Service Project Staqe.
Build with [Nuxt3](https://nuxt.com/)

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Docker

The service can ben run in a docker container. To build the image run:

```bash
    docker build -t staqe-frontend .
```

To run the container:

```bash
    docker run -p 3000:3000 staqe-frontend
```

## Kubernetes

The service can be deployed to a kubernetes cluster. The deployment file is located in the kubernetes folder `k8s`. Make sure to edit the image name in the deployment file and upload the docker image to a registry.

Also make sure to edit the ingress file to use the correct domain name.

```bash
kubectl apply -f k8s/
```
