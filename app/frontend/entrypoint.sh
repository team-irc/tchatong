#!/bin/sh
rm ./node_modules
ln -s /frontend_init/node_modules ./
npm run build && npm run start
