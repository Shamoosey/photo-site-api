export interface AlbumDTO {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  defaultAlbum: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
