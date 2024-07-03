// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/main',
} = process.env;
console.log(DEPLOY_HOST, DEPLOY_PATH, DEPLOY_USER);
module.exports = {
  apps: [
    {
      name: 'api-service',
      script: 'node dist/main.js',
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/Cantarella/kupipodariday-backend.git',
      path: DEPLOY_PATH,
      'pre-deploy': `scp -C ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'npm i && npm run start',
    },
  },
};
