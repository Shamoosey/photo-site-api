import "reflect-metadata";
import { Request, Response } from "express";
import * as PhotoCollectionService from "../services/photoCollection.service";
import { Controller, Delete, Get, Param, Post, Put, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";

@Controller("/photo-collection")
export class PhotoCollectionController {
  @Get()
  async getAllPhotoCollections(@Req() req: Request, @Res() res: Response) {}

  @Get(":id")
  async getPhotoCollection(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const collection = await PhotoCollectionService.fetchCollectionById(id);
      res.status(200).json(successResponse(collection, "Photo collection retreived successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createPhotoCollection(@Req() req: Request, @Res() res: Response) {
    try {
      const { name, description, photoIds } = req.body;
      const newCollection = await PhotoCollectionService.createCollection(name, description, photoIds);
      res.status(200).json(successResponse(newCollection, "Photo collection created successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async editPhotoCollection(@Req() req: Request, @Res() res: Response) {
    try {
      const { collectionId, name, description, photoIds } = req.body;
      const editedCollection = await PhotoCollectionService.editCollection(collectionId, name, description, photoIds);
      res.status(200).json(successResponse(editedCollection, "Photo collection edited successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deletePhotoCollection(@Req() req: Request, @Res() res: Response) {
    try {
      const { collectionId } = req.body;
      await PhotoCollectionService.deleteCollection(collectionId);
      res.status(200).json(successResponse(undefined, "Photo collection deleted successfully"));
    } catch (error) {
      throw error;
    }
  }
}
