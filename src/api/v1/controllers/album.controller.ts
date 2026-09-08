import "reflect-metadata";
import { Request, Response } from "express";
import * as AlbumService from "../services/album.service";
import { Controller, Delete, Get, Param, Post, Put, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";
import { getAuth } from "@clerk/express";

@Controller("/album")
export class AlbumController {
  @Get()
  async getAllAlbums(@Req() req: Request, @Res() res: Response) {
    try {
      const albums = await AlbumService.getAllAlbums();
      return res.status(200).json(successResponse(albums, "All albums retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createAlbum(@Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { name, description, coverImageBase64, imageIds } = req.body;
      const album = await AlbumService.createAlbum(name, description, coverImageBase64, imageIds);
      return res.status(201).json(successResponse(album, "New album created successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Put("/:id")
  async editAlbum(@Param("id") albumId: string, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const album = await AlbumService.editAlbum(albumId, req.body);
      return res.status(200).json(successResponse(album, "Album updated successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Delete("/:id")
  async deleteAlbum(@Param("id") albumId: string, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await AlbumService.deleteAlbum(albumId);
      return res.status(200).json(successResponse("Album deleted successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Get("/:albumId/images")
  async getAlbumImages(@Param("albumId") albumId: string, @Req() req: Request, @Res() res: Response) {
    try {
      const images = await AlbumService.getImagesByAlbumId(albumId);
      return res.status(200).json(successResponse(images, "Images in album retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }
}
