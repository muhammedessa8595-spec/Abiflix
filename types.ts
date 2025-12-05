export type ContentType = 'movie' | 'series';

export interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  genres: string[];
  country: string;
  releaseYear: number;
  rating: number; // 0-10
  posterUrl: string;
  bannerUrl: string;
  videoUrl?: string; // For movies
  trailerUrl: string;
  seasons?: Season[]; // For series
  cast: string[];
  trending: boolean;
  addedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  watchlist: string[]; // List of Content IDs
  history: string[]; // List of Content IDs
  isAdmin: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  recommendedContentIds?: string[];
}