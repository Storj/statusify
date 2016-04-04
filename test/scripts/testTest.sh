#!/bin/bash

curl -XPOST http://localhost:4000/ -d '{
  "method": "insert",
  "id": 1234567,
  "params": [
    "test",
    "test"
  ]
}'
