import { ImageDTO } from "./ImageDTO";

export interface ImageCollectionDTO {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  images: ImageDTO[];
}
