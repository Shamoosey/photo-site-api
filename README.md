### Photo Site API

This repo is the API for https://github.com/Shamoosey/photo-site

1.  Use `docker compose up` to run the local postgres databse
2.  Use `npm run prisma:migrate-dev` and `npm run prisma:generate` to create the tables and prisma code for the database
3.  `npm run prisma:seed` to seed the database with mock data for testing
4.  `npm run dev` to run the API application

### env variables for local dev

```sh
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/postgres"
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3000

SPACES_KEY=
SPACES_SECRET=
SPACES_REGION=
SPACES_ENDPOINT=
SPACES_BUCKET=
SPACES_UPLOAD_FOLDER=
SPACES_PUBLIC_URL=
```
