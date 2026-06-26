export interface ImageDTO {
  id: string;
  imageUrl: string;
  cloudinaryId: string;
  caption: string | null;
  metaData: string | null;
  createdAt: Date;
  updatedAt: Date;
}
