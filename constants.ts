import { Content, User } from './types';

export const COUNTRIES = ['USA', 'India', 'Turkey', 'Korea', 'China', 'Japan', 'UK'];
export const GENRES = ['Action', 'Drama', 'Thriller', 'Romance', 'Comedy', 'Horror', 'Anime', 'Sci-Fi', 'Documentary'];

export const INITIAL_CONTENT: Content[] = [
  {
    id: '1',
    title: 'Cyber Runner 2077',
    description: 'In a dystopian future, a mercenary outlaw navigates a city obsessed with power and body modification.',
    type: 'movie',
    genres: ['Sci-Fi', 'Action'],
    country: 'USA',
    releaseYear: 2024,
    rating: 8.9,
    posterUrl: 'https://picsum.photos/300/450?random=1',
    bannerUrl: 'https://picsum.photos/1200/600?random=1',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    trailerUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cast: ['Keanu R.', 'Ana D.', 'Idris E.'],
    trending: true,
    addedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Seoul Nights',
    description: 'A gripping drama about a group of friends navigating the competitive world of fashion in Gangnam.',
    type: 'series',
    genres: ['Drama', 'Romance'],
    country: 'Korea',
    releaseYear: 2023,
    rating: 9.2,
    posterUrl: 'https://picsum.photos/300/450?random=2',
    bannerUrl: 'https://picsum.photos/1200/600?random=2',
    trailerUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    cast: ['Park S.', 'Kim J.', 'Lee M.'],
    trending: true,
    addedAt: Date.now(),
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        episodes: [
          { id: 'e1', title: 'The Beginning', duration: '45m', description: 'Pilot episode.', thumbnailUrl: 'https://picsum.photos/200/120?random=101', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
          { id: 'e2', title: 'Betrayal', duration: '48m', description: 'Secrets are revealed.', thumbnailUrl: 'https://picsum.photos/200/120?random=102', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'The Ottoman Legacy',
    description: 'Historical epic tracing the rise of an empire through the eyes of a warrior.',
    type: 'series',
    genres: ['Action', 'History'],
    country: 'Turkey',
    releaseYear: 2022,
    rating: 8.5,
    posterUrl: 'https://picsum.photos/300/450?random=3',
    bannerUrl: 'https://picsum.photos/1200/600?random=3',
    trailerUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    cast: ['Burak O.', 'Engin A.'],
    trending: false,
    addedAt: Date.now(),
    seasons: [
        {
          id: 's1',
          seasonNumber: 1,
          episodes: [
             { id: 'e1', title: 'Rise', duration: '60m', description: 'The journey begins.', thumbnailUrl: 'https://picsum.photos/200/120?random=103', videoUrl: '' }
          ]
        }
    ]
  },
  {
    id: '4',
    title: 'Mumbai Shadows',
    description: 'An undercover cop infiltrates the underworld of Mumbai to avenge his partner.',
    type: 'movie',
    genres: ['Action', 'Thriller'],
    country: 'India',
    releaseYear: 2023,
    rating: 7.8,
    posterUrl: 'https://picsum.photos/300/450?random=4',
    bannerUrl: 'https://picsum.photos/1200/600?random=4',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    trailerUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    cast: ['Shah R.', 'Deepika P.'],
    trending: true,
    addedAt: Date.now(),
  },
  {
    id: '5',
    title: 'Dragon Spirit',
    description: 'A young martial artist discovers an ancient secret that could change the fate of China.',
    type: 'movie',
    genres: ['Action', 'Fantasy'],
    country: 'China',
    releaseYear: 2021,
    rating: 8.1,
    posterUrl: 'https://picsum.photos/300/450?random=5',
    bannerUrl: 'https://picsum.photos/1200/600?random=5',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    trailerUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    cast: ['Jackie C.', 'Jet L.'],
    trending: false,
    addedAt: Date.now(),
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@abiflix.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  watchlist: ['1', '3'],
  history: ['2'],
  isAdmin: false, // Default to false to demonstrate login flow
};