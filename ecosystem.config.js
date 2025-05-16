module.exports = {
    apps: [
      {
        name: 'strapi-backend',
        cwd: '/home/jfz/youarewe-monorepo',
        script: 'pnpm',
        args: '--filter @youarewe/api dev',
        env: {
          NODE_ENV: 'development',
          DATABASE_CLIENT: 'postgres',
          DATABASE_HOST: '127.0.0.1',
          DATABASE_PORT: '5432',
          DATABASE_NAME: 'youarewe_db',
          DATABASE_USERNAME: 'youarewe',
          DATABASE_PASSWORD: 'e1312409',
          DATABASE_SSL: 'false',
          HOST: '0.0.0.0',
          PORT: '1337',
          APP_KEYS: 'ekF+1wOWnLiS7201/6j0Nw==,ee0OOu7KzkAaTgO1CFS6Mg==,RiYxH9zMM4wztSjEhEspDA==,i5uf11hqLS7WSNsHDiJr6w==',
          API_TOKEN_SALT: 'tjUtuK8EWMlO5WEzELIwaw==',
          ADMIN_JWT_SECRET: 'FQ9C/sT3FF9F6KulPTg/sw==',
          TRANSFER_TOKEN_SALT: '3hCLAs54E79+fFiYK9Ye1Q==',
          FRONTEND_URL: 'http://localhost:3000'
        },
        watch: false,
        time: true,
        instance_var: 'INSTANCE_ID',
        autorestart: true,
        max_restarts: 10
      },
      {
        name: 'nextjs-frontend',
        cwd: '/home/jfz/youarewe-monorepo',
        script: 'pnpm',
        args: '--filter @youarewe/web dev',
        env: {
          NODE_ENV: 'development',
          NEXT_PUBLIC_API_URL: 'http://localhost:1337',
          NEXTAUTH_URL: 'http://localhost:3000',
          NEXTAUTH_SECRET: 'FQ9C/sT3FF9F6KulPTg/sw==',
          API_URL: 'http://localhost:1337'
        },
        watch: false,
        time: true,
        instance_var: 'INSTANCE_ID',
        autorestart: true,
        max_restarts: 10
      }
    ]
  };