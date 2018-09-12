#!/bin/bash

npm i --build-from-source
npm run build:once
pm2-runtime start pm2.json --web ${PM2_PORT}
