import "reflect-metadata";
import { Request, Response } from "express";
import * as PhotoService from "../services/photo.service";
import { Controller, Delete, Get, Post, Put, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";

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

  @Put()
  async editPhotoData(@Req() req: Request, @Res() res: Response) {
    try {
      const { photoId, caption, metaData } = req.body;
      const photo = await PhotoService.editPhotoData(photoId, caption, metaData);

      res.status(200).json(successResponse(photo, "Photo data successfully modified"));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createPhoto(@Req() req: Request, @Res() res: Response) {
    try {
      const { imageBase64, metaData, caption } = req.body;
      const photo = await PhotoService.createPhoto(imageBase64, caption, metaData);
      return res.status(200).json(successResponse(photo, "New photo created successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deletePhoto(@Req() req: Request, @Res() res: Response) {
    try {
      const { imageId } = req.body;
      await PhotoService.deletePhoto(imageId);
      return res.status(200).json(successResponse("Photo deleted successfully"));
    } catch (error) {
      throw error;
    }
  }
}
