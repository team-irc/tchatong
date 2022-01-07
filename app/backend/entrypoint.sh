#!/bin/sh
rm /backend/node_modules
ln -s /backend_init/node_modules ./
npm run start:dev -watch
export PATH=$PATH:/backend/node_modules/@nestjs/cli/bin
