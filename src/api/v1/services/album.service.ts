import prisma from "prisma/client";
import { AlbumDTO } from "../types/AlbumDTO";
import { CloudinaryService } from "./cloudinary.service";
import { EditAlbumDTO } from "../types/EditAlbumDTO";
import { ImageDTO } from "../types/ImageDTO";

export const getImagesByAlbumId = async (albumId: string) => {
  const album = await prisma.album.findFirst({
    where: {
      id: albumId,
    },
  });

  if (!album) {
    throw new Error(`Album does not exist with ID: ${albumId}`);
  }

  const albumImages = await prisma.albumImage.findMany({
    where: {
      albumId: albumId,
    },
    include: {
      image: true,
    },
  });

  return albumImages.map((x) => {
    return {
      ...x.image,
    };
  }) as ImageDTO[];
};

export const getAllAlbums = async () => {
  const albums = await prisma.album.findMany();
  return albums.map((x) => {
    return {
      ...x,
    } as AlbumDTO;
  });
};

export const createAlbum = async (name: string, description: string, coverImageBase64: string, imageIds: string[]) => {
  if (!coverImageBase64) {
    throw new Error("coverImageBase64 is undefined, unable to upload image");
  }

  const image = await CloudinaryService.uploadImage(coverImageBase64);

  try {
    const newAlbum = await prisma.$transaction(async (tx) => {
      const album = await tx.album.create({
        data: {
          name,
          description,
          coverImageCloudinaryId: image.public_id,
          coverImageUrl: image.url,
        },
      });

      if (imageIds.length > 0) {
        await tx.albumImage.createMany({
          data: imageIds.map((imageId) => ({ imageId, albumId: album.id })),
        });
      }

      return album;
    });

    return { ...newAlbum } as AlbumDTO;
  } catch (err) {
    await CloudinaryService.deleteImage(image.public_id);
    throw err;
  }
};

export const editAlbum = async (albumId: string, editData: EditAlbumDTO) => {
  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
  });

  if (!album) {
    throw new Error(`Album does not exist with ID: ${albumId}`);
  }

  let newImage = null;
  if (editData.coverImageBase64) {
    newImage = await CloudinaryService.uploadImage(editData.coverImageBase64);
  }

  try {
    const editedAlbum = await prisma.$transaction(async (tx) => {
      const updated = await tx.album.update({
        where: {
          id: albumId,
        },
        data: {
          name: editData.name,
          description: editData.description,
          coverImageUrl: newImage !== null ? newImage.url : album.coverImageUrl,
          coverImageCloudinaryId: newImage !== null ? newImage.public_id : album.coverImageCloudinaryId,
        },
      });

      await tx.albumImage.deleteMany({
        where: {
          albumId: updated.id,
        },
      });

      if (editData.images.length > 0) {
        await tx.albumImage.createMany({
          data: editData.images.map((imageId) => ({ imageId, albumId: updated.id })),
        });
      }

      return updated;
    });

    if (newImage !== null) {
      await CloudinaryService.deleteImage(album.coverImageCloudinaryId);
    }

    return { ...editedAlbum } as AlbumDTO;
  } catch (err) {
    if (newImage !== null) {
      await CloudinaryService.deleteImage(newImage.public_id);
    }
    throw err;
  }
};

export const deleteAlbum = async (albumId: string) => {
  const album = await prisma.album.findFirst({
    where: {
      id: albumId,
    },
  });

  if (album) {
    await prisma.albumImage.deleteMany({
      where: {
        albumId: albumId,
      },
    });
    CloudinaryService.deleteImage(album.coverImageCloudinaryId);
    await prisma.album.delete({
      where: {
        id: albumId,
      },
    });
  }
};
