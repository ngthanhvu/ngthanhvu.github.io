export interface ShortUrl {
  id: number;
  code: string;
  originalUrl: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date | null;
}

export interface CreateShortUrlInput {
  code: string;
  originalUrl: string;
}
