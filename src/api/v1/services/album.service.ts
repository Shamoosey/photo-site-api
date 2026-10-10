import prisma from "../../../../prisma/client";
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

export const getAlbumById = async (id: string) => {
  const album = await prisma.album.findFirstOrThrow({
    where: {
      id: id,
    },
  });
  return {
    ...album,
  } as AlbumDTO;
};

export const getAllAlbums = async () => {
  const albums = await prisma.album.findMany();
  return albums.map((x) => {
    return {
      ...x,
    } as AlbumDTO;
  });
};

export const createAlbum = async (
  name: string,
  description: string,
  coverImageUrl: string,
  coverImageId: string,
  isDraft: boolean,
) => {
  try {
    const newAlbum = await prisma.$transaction(async (tx) => {
      const album = await tx.album.create({
        data: {
          name,
          description,
          coverImageCloudinaryId: coverImageId,
          coverImageUrl: coverImageUrl,
          isDraft: isDraft,
        },
      });

      return album;
    });

    return { ...newAlbum } as AlbumDTO;
  } catch (err) {
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

  try {
    const editedAlbum = await prisma.$transaction(async (tx) => {
      const updated = await tx.album.update({
        where: {
          id: albumId,
        },
        data: {
          name: editData.name,
          isDraft: editData.isDraft,
          description: editData.description,
          coverImageUrl: editData.coverImageUrl,
          coverImageCloudinaryId: editData.coverImageId,
          sortOrder: Number.parseInt(editData.sortOrder ?? "0"),
        },
      });

      return updated;
    });

    return { ...editedAlbum } as AlbumDTO;
  } catch (err) {
    throw err;
  }
};

export async function deleteAlbum(albumId: string) {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: {
      albumImage: {
        include: { image: true },
      },
    },
  });

  if (!album) return;

  const images = album.albumImage.map((ai) => ai.image).filter((img) => img != null);

  const cloudinaryResults = await Promise.allSettled([
    CloudinaryService.deleteImage(album.coverImageCloudinaryId),
    ...images.map((img) => CloudinaryService.deleteImage(img.cloudinaryId)),
  ]);

  cloudinaryResults.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`Failed to delete Cloudinary asset (index ${i}) for album ${albumId}:`, result.reason);
    }
  });

  await prisma.$transaction([
    prisma.albumImage.deleteMany({ where: { albumId } }),
    prisma.image.deleteMany({ where: { id: { in: images.map((img) => img.id) } } }),
    prisma.album.delete({ where: { id: albumId } }),
  ]);
}
