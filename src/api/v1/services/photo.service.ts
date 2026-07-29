import { ImageDTO } from "../types/ImageDTO";
import { CloudinaryService } from "./cloudinary.service";
import prisma from "../../../../prisma/client";

export const fetchAllPhotos = async (): Promise<ImageDTO[]> => {
  return await prisma.image.findMany();
};

export const createPhoto = async (imageBase64: string, caption?: string, metaData?: string): Promise<ImageDTO> => {
  if (!imageBase64) {
    throw new Error("ImageBase64 is undefined, unable to upload image");
  }

  const result = await CloudinaryService.uploadImage(imageBase64);

  const newImage = await prisma.image.create({
    data: {
      imageUrl: result.url,
      cloudinaryId: result.public_id,
      caption,
      metaData,
    },
  });

  return newImage;
};

export const deletePhoto = async (imageId: string): Promise<void> => {
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

export const editPhotoData = async (imageId: string, caption?: string, metaData?: string): Promise<ImageDTO> => {
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
      metaData,
    },
  });

  return updatedImage;
};
