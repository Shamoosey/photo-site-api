export interface ImageDTO {
  id: string;
  imageUrl: string;
  publicId: string;
  caption: string | null;
  metaData: string | null;
  createdAt: Date;
  updatedAt: Date;
}
