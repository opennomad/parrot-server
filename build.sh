#!/bin/bash

# TODO: this needs to be set up
docker build -t parrot-server .
docker tag parrot-server:latest '<registry>'
docker push ''
