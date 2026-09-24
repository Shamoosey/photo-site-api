export interface CreateImageDTO {
  albumId: string;
  imageBase64: string;
  caption: string;
  metaData: string;
  sortOrder: number;
}
