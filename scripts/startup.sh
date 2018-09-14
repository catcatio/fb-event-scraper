#!/bin/bash

npm i --build-from-source
pm2-runtime start pm2.json --web ${PM2_PORT}
