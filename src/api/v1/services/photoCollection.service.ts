import { Image, ImageCollection } from "prisma/generated/prisma";
import prisma from "../../../../prisma/client";
import { ImageCollectionDTO } from "../types/ImageCollectionDTO";
import { ImageDTO } from "../types/ImageDTO";

export const createCollection = async (
  name: string,
  description: string,
  imageIds: string[],
): Promise<ImageCollectionDTO> => {
  const images =
    imageIds.length > 0
      ? await prisma.image.findMany({
          where: {
            id: {
              in: imageIds,
            },
          },
        })
      : [];

  const collection = await prisma.$transaction(async (tx) => {
    const newCollection = await tx.collection.create({
      data: {
        name: name.toLowerCase(),
        description,
      },
    });

    if (images.length > 0) {
      const imageCollectionData = images.map((x) => ({
        collectionId: newCollection.id,
        imageId: x.id,
      })) as ImageCollection[];

      await tx.imageCollection.createMany({
        data: imageCollectionData,
        skipDuplicates: true,
      });
    }

    return newCollection;
  });

  return await fetchCollectionByIdOrName(collection.id);
};

export const editCollection = async (
  collectionId: string,
  name: string,
  description: string,
  imageIds: string[],
): Promise<ImageCollectionDTO> => {
  const images =
    imageIds.length > 0
      ? await prisma.image.findMany({
          where: { id: { in: imageIds } },
        })
      : [];

  await prisma.$transaction(async (tx) => {
    await tx.collection.update({
      data: { name: name.toLowerCase(), description },
      where: { id: collectionId },
    });

    await tx.imageCollection.deleteMany({
      where: { collectionId },
    });

    if (images.length > 0) {
      const imageCollectionData = images.map((x) => ({
        collectionId,
        imageId: x.id,
      }));

      await tx.imageCollection.createMany({
        data: imageCollectionData,
        skipDuplicates: true,
      });
    }
  });

  return await fetchCollectionByIdOrName(collectionId);
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  await prisma.imageCollection.deleteMany({
    where: {
      collectionId: collectionId,
    },
  });

  await prisma.collection.delete({
    where: {
      id: collectionId,
    },
  });
};

export const fetchAllCollections = async (): Promise<ImageCollectionDTO[]> => {
  const collections = await prisma.collection.findMany({
    include: {
      imageCollection: {
        include: {
          image: true,
        },
      },
    },
  });

  return collections.map((x) => ({ ...x, images: x.imageCollection.map((y) => ({ ...y.image }) as ImageDTO) }));
};

export const fetchCollectionByIdOrName = async (
  collectionId?: string,
  collectionName?: string,
): Promise<ImageCollectionDTO> => {
  const collection = await prisma.collection.findFirstOrThrow({
    where: {
      OR: [
        {
          id: collectionId,
        },
        {
          name: collectionName?.toLowerCase(),
        },
      ],
    },

    include: {
      imageCollection: {
        include: {
          image: true,
        },
      },
    },
  });

  return {
    ...collection,
    images: collection.imageCollection.map((y) => ({ ...y.image }) as ImageDTO),
  } as ImageCollectionDTO;
};
