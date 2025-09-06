const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.deploy') });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/main',
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-api',
      cwd: 'backend',
      script: './dist/app.js',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 3000 },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'git@github.com:Sayd-Ali/nodejs-mesto-project.git',
      path: DEPLOY_PATH,

      // создаём shared (на сервере)
      'pre-deploy': 'mkdir -p $PM2_DEPLOY_PATH/shared',

      // ЛОКАЛЬНО: копируем твой backend/.env на сервер в shared/.env
      'pre-deploy-local':
        'scp backend/.env ' +
        DEPLOY_USER + '@' + DEPLOY_HOST + ':' + DEPLOY_PATH + '/shared/.env',

      // в каталоге релиза
      'post-deploy': [
        'cd backend && npm ci && npm run build',
        'pm2 startOrReload backend/ecosystem.config.js --env production',
        'pm2 save'
      ].join(' && '),
    },
  },
};
