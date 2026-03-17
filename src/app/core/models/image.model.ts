export type ImageStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ImageSummary {
  id: string;
  fileName: string;
  originalUrl: string;
  thumbnailUrl: string | null;
  mediumUrl: string | null;
  largeUrl: string | null;
  status: ImageStatus;
  createdAt: string;
}

export interface ImageListResponse {
  images: ImageSummary[];
  total: number;
  limit: number;
  offset: number;
}