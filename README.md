The parrot-server is a bit like the `echo-server`, but with additonal features. It's purpose is to aid in the debugging of service accessibiltiy, header information, and timeouts.

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

### headers

/headers

/upload

/pause


- echo headers
- echo string with possible repetition
- return random string with defineable lenght
- return date and time stamp
- sleep/delay/wait for defined amount of time
    curl -XPOST -H "Content-Type: application/json" localhost:8000/pause -d '{"pause":2}'
    curl 'localhost:8000/pause?pause=2'
- fetch another URL and return it
