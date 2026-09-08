import "reflect-metadata";
import { Request, Response } from "express";
import * as ImageService from "../services/image.service";
import { Controller, Delete, Get, Param, Post, Put, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";
import { getAuth } from "@clerk/express";

@Controller("/image")
export class ImageController {
  @Get()
  async getImageById(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const images = await ImageService.getImageById(id);
      return res.status(200).json(successResponse(images, "All images retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Put("/:id")
  async editImageData(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const image = await ImageService.editImageData(id, req.body.caption, req.body.metaData, req.body.sortOrder);
      return res.status(200).json(successResponse(image, "Image data updated successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createImage(@Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { imageBase64, metaData, caption, sortOrder } = req.body;
      const image = await ImageService.createImage(imageBase64, caption, metaData, sortOrder);
      return res.status(200).json(successResponse(image, "New image created successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Delete("/:id")
  async deleteImage(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await ImageService.deleteImage(id);
      return res.status(200).json(successResponse("Image deleted successfully"));
    } catch (error) {
      throw error;
    }
  }
}
