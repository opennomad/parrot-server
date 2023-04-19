# Running the server ...

The default port for the parrot-server is 8000. To override this, use the `PORT` environment variable.

## Docker

#### Docker image from GitHub:
```sh
docker pull ghcr.io/opennomad/parrot-server
docker run -p 8000:8000 ghcr.io/opennomad/parrot-server
```

#### Build your own Docker image
```sh
git clone https://github.com/opennomad/parrot-server.git
cd parrot-server
docker build -t parrot-server .
export PORT=8000
docker run -d --expose ${PORT} -p${PORT}:${PORT} parrot-server
```

## Kubernetes

There are a lot of ways to run containers in Kubernetes. For convenience a simple config is provided which creates a `Deployment` and associated `Service` which is exposed via NodePort. Edit the provided sample to your liking.

```sh
curl -O https://raw.githubusercontent.com/opennomad/parrot-server/main/k8s.yaml
kubectl apply -f k8s.yaml
```

## Local command line

**Note: For all of the following you will need to have NodeJS installed and the `node` and `npm` binaries available.**

#### Via NPM from GitHub source

```sh
npm install -g opennomad/parrot-server
export PORT=8000
parrot-server
```

#### Via NPM package

The NPM package lives in the GitHub NPM repository. This will need to be added to your `.npmrc`. Additionally, GitHub requires authentication token, including for public packages, so you will need to set up your own and use it below instead of `YOUR_TOKEN`

```sh
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc
echo '@opennomad:registry=https://npm.pkg.github.com' >> ~/.npmrc
npm install -g @opennomad/parrot-server
export PORT=8000
parrot-server
```

#### Straight from source code

```sh
git clone https://github.com/opennomad/parrot-server.git
npm install
cd parrot-server
PORT=8000 node app.js 
```

