import "reflect-metadata";
import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import morgan from "morgan";
import corsOptions from "./config/corsOptions";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

useExpressServer(app, {
  routePrefix: "/api/v1",
  controllers: [__dirname + "/api/v1/controllers/*.ts"],
  cors: corsOptions,
});

dotenv.config();

const PORT = process.env.PORT ?? 3000;

setupSwagger(app, PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
