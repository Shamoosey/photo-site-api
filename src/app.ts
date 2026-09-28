import "reflect-metadata";
import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import morgan from "morgan";
import corsOptions from "./config/corsOptions";
import { setupSwagger } from "./config/swagger";
import { clerkMiddleware } from "@clerk/express";
import { ImageController } from "./api/v1/controllers/image.controller";
import { AlbumController } from "./api/v1/controllers/album.controller";

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(clerkMiddleware());

useExpressServer(app, {
  routePrefix: "/api/v1",
  controllers: [ImageController, AlbumController],
  cors: corsOptions,
});

dotenv.config();

const PORT = process.env.PORT ?? 3000;

setupSwagger(app, PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
