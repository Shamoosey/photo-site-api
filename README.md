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
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```
