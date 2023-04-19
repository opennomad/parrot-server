[![ESLint](https://github.com/opennomad/parrot-server/actions/workflows/eslint.yaml/badge.svg)](https://github.com/opennomad/parrot-server/actions/workflows/eslint.yaml)
[![Node.js CI](https://github.com/opennomad/parrot-server/actions/workflows/node.js.yaml/badge.svg)](https://github.com/opennomad/parrot-server/actions/workflows/node.js.yaml)
[![Docker CI](https://github.com/opennomad/parrot-server/actions/workflows/docker.yaml/badge.svg)](https://github.com/opennomad/parrot-server/actions/workflows/docker.yaml)
[![NPM Package](https://github.com/opennomad/parrot-server/actions/workflows/npm-publish.yaml/badge.svg)](https://github.com/opennomad/parrot-server/actions/workflows/npm-publish.yaml)
[![Docker Package](https://github.com/opennomad/parrot-server/actions/workflows/docker-publish.yaml/badge.svg)](https://github.com/opennomad/parrot-server/actions/workflows/docker-publish.yaml)

The parrot-server is a bit like the [Echo-Server](https://ealenn.github.io/Echo-Server/), but with additional features. Its purpose is to aid in the debugging of 
- service accessibility
- header information
- timeouts

## Running the parrot-server

The primary use is to run via a container in Docker or Kubernetes:

```sh
docker pull ghcr.io/opennomad/parrot-server
docker run -p 8000:8000 ghcr.io/opennomad/parrot-server
```
or

```sh
curl -O https://raw.githubusercontent.com/opennomad/parrot-server/main/k8s.yaml
kubectl apply -f k8s.yaml
```

See [Install Options](./docs/install_options.md) or other ways of running the service, including locally.

## Features and usage


### /health
The `/health` endpoint returns `200` and `OK`. Always start here to make sure the service is reachable.

```sh
$ curl localhost:8000/health
OK
```

### /headers

The `/headers` endpoint returns all headers that made it to the service. This allows testing of header transformations, stripping, etc.
```
$ curl -H 'Host: foo.bar.com' -H 'x-my-special-field: monkeys' localhost:8000/headers
{
  "host": "foo.bar.com",
  "user-agent": "curl/7.74.0",
  "accept": "*/*",
  "x-my-special-field": "monkeys"
}
```

### /echo
The `/echo` endpoint will return the query string or body received. This also enables testing of transformations, etc of requests. 

```
# query string
$ curl 'localhost:8000/echo?test=foo'
{"test":"foo"}% 

# body payload
curl 'localhost:8000/echo' -d'test=foo' -d'test=bar'
{"test":["foo","bar"]}% 
```

### /pause

The `/pause` endpoint will sleep for the specified length of time. This is useful for testing timeouts. When no response comes back, a timeout has been exceeded. Test the `/health` endpoint first to ensure the service is reachable.

```
# using query parameter
$ curl 'localhost:8000/pause?seconds=5'
Pause complete after 5 seconds% 

# using POST and request body
curl -XPOST 'localhost:8000/pause' -d 'seconds=5'
Pause complete after 5 seconds%
```

### /upload
The `/upload` endpoint allows uploading, listing, fetching, and deleting of files. This can be used to test if there are upload limits in place.

**Note: This is not intended to be a file server. There are no security or safety checks. There is no authentication. This is purely for debugging purposes.**

```sh
# upload the file
$ curl -XPOST localhost:8000/upload -F 'file=@/etc/resolv.conf'
{
  "file": "/uploads/resolv.conf",
  "md5": "c24158be15d674d6ff31815b8e83316a",
  "sha1": "216d98d31c01ea099ce27d5537626238519512bf",
  "sha256": "0e52be9a9dfd65bef09398ef03e4c6c600d99e4e5313f81cb6f53e455dbf7c30"
}%

# list the files
$ curl -XGET localhost:8000/upload
[
  "resolv.conf"
]%

# get the file
$ curl -XGET localhost:8000/upload/resolv.conf

# delete the file
$ curl -XDELETE localhost:8000/upload/resolv.conf
resolv.conf has been deleted
```

# Future ideas
- add proxy ability to fetch another URL
- test DNS resolution
- test for reachability (open port)
