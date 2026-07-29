import "reflect-metadata";
import { Request, Response } from "express";
import * as PhotoService from "../services/photo.service";
import { Controller, Delete, Get, Param, Post, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";
import { getAuth } from "@clerk/express";

@Controller("/photo")
export class PhotoController {
  @Get()
  async getAllPhotos(@Req() req: Request, @Res() res: Response) {
    try {
      const photos = await PhotoService.fetchAllPhotos();
      return res.status(200).json(successResponse(photos, "All photos retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createPhoto(@Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { imageBase64, metaData, caption } = req.body;
      const photo = await PhotoService.createPhoto(imageBase64, caption, metaData);
      return res.status(200).json(successResponse(photo, "New photo created successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Delete("/:id")
  async deletePhoto(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await PhotoService.deletePhoto(id);
      return res.status(200).json(successResponse("Photo deleted successfully"));
    } catch (error) {
      throw error;
    }
  }
}
