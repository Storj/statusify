#!/bin/bash

curl -XPOST http://localhost:4000/report -d '{
  "id": "jj3kjfk3j9876svhblk3j234",
  "method": "REPORT",
  "params": {
    "store": {
      "free": 1000,
      "used": 100
    },
    "bandwidth": {
      "upload": 10.5,
      "download": 100.8
    },
    "node": {
      "id": "12D900BC92350EC",
      "ip": "10.10.1.15",
      "port": 1234
    },
    "timestamp": 1459529861,
    "payment": "jlk3j4k2j34lkjk2l3k4j23gh423lk4",
    "signature": "thisismysigpleasevalidateitnow"
  }
}'
