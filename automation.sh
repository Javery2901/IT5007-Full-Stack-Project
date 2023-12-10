#!/bin/bash

# load nvm and use specific version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 20.5.0
nvm use 20.5.0

# install node modules
npm install

# initiate mongodb 
systemctl start mongod && mongo projectdb scripts/initmongo.js &

# start vite frontend server 
npx vite build && npx vite &

# start backend server 
npx nodemon -w server -e js,graphql server/server.js &
