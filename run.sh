#!/bin/bash
HOST=$1
SESSION=$2
RUNS=$3

k6 run -e SESSION_ID=$SESSION -e IMPLEMENTATION=GraphQL.GraphQLNet.C20 /home/utu/humza/rq3-graphql/k6-graphql.js