The parrot-server is a bit like the [Echo-Server](https://ealenn.github.io/Echo-Server/), but with additonal features. It's purpose is to aid in the debugging of service accessibiltiy, header information, and timeouts.

# Running the server ...

The default port for the parrot-server is 8000. To override this the `PORT` environment variable can be set.

## ... on the command line

```sh
PORT=8000 node app.js 
```

##  ... in docker

```sh
docker build -t parrot-server .
export PORT=8000
docker run -d --expose ${PORT} -p${PORT}:${PORT} parrot-server
```

# ... in Kubernetes

## Features


### /health
The `/health` endpoint returns `200` and `OK`.

### /headers

The `/headers` endpoint returns all headers that made it to the service.
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
The `/echo` endpoint will return the query string or body received

```
# query string
$ curl 'localhost:8000/echo?test=foo'
{"test":"foo"}% 

# body payload
curl 'localhost:8000/echo' -d'test=foo' -d'test=bar'
{"test":["foo","bar"]}% 
```

### /pause

The `/pause` endpoint will sleep for the specified length of time
/upload

```
# using query parameter
$ curl 'localhost:8000/pause?seconds=5'
Pause complete after 5 seconds% 

# using POST and request body
curl -XPOST 'localhost:8000/pause' -d 'seconds=5'
Pause complete after 5 seconds%
```

### /upload
The `/upload` endpoint allows uploading, listing, fetching, and deleting of files.

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

# get the File
$ curl -XGET localhost:8000/upload/resolv.conf

# delete the file
$ curl -XDELETE localhost:8000/upload/resolv.conf
resolv.conf has been deleted
```

# Future ideas
- add proxy ability to fetch another URL
