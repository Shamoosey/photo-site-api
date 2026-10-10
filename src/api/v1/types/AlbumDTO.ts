export interface AlbumDTO {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  defaultAlbum: boolean;
  isDraft: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
