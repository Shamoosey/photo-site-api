import { ImageDTO } from "../types/ImageDTO";
import { CloudinaryService } from "./cloudinary.service";
import prisma from "../../../../prisma/client";

export const getImageById = async (imageId: string): Promise<ImageDTO | null> => {
  return await prisma.image.findFirst({
    where: {
      id: imageId,
    },
  });
};

export const createImage = async (
  imageBase64: string,
  caption: string,
  metaData: string,
  sortOrder: number,
): Promise<ImageDTO> => {
  if (!imageBase64) {
    throw new Error("ImageBase64 is undefined, unable to upload image");
  }

  const result = await CloudinaryService.uploadImage(imageBase64);

  const maxSortOrder = await prisma.image.aggregate({
    _max: {
      sortOrder: true,
    },
  });

  const newImage = await prisma.image.create({
    data: {
      imageUrl: result.url,
      cloudinaryId: result.public_id,
      caption,
      metaData,
      sortOrder: sortOrder == 0 ? (maxSortOrder._max.sortOrder ? maxSortOrder._max.sortOrder + 1 : 0) : sortOrder,
    },
  });

  return newImage;
};

export const deleteImage = async (imageId: string): Promise<void> => {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
    },
  });

  if (image) {
    await CloudinaryService.deleteImage(image.cloudinaryId);
    await prisma.image.delete({
      where: {
        id: imageId,
      },
    });
  }
};

export const editImageData = async (
  imageId: string,
  caption: string,
  metaData: string,
  sortOrder: number,
): Promise<ImageDTO> => {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  const updatedImage = await prisma.image.update({
    where: {
      id: imageId,
    },
    data: {
      caption,
      sortOrder,
      metaData,
    },
  });

  return updatedImage;
};
