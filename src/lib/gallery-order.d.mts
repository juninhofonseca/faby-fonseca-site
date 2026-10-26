export interface PhotoOrderLike {
  order: number;
  publishedAt?: Date;
  title: string;
}

export function comparePhotoOrder(a: PhotoOrderLike, b: PhotoOrderLike): number;
