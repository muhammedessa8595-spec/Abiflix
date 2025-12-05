import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, Play } from 'lucide-react';
import { db } from '../services/storage';
import { Content, ContentType } from '../types';
import { COUNTRIES, GENRES } from '../constants';
import { VideoPlayer } from '../components/VideoPlayer';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Content[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);

  useEffect(() => {
    let filtered = db.getAllContent();

    if (query) {
      filtered = db.searchContent(query);
    }

    if (selectedGenre) {
      filtered = filtered.filter(c => c.genres.includes(selectedGenre));
    }
    if (selectedCountry) {
      filtered = filtered.filter(c => c.country === selectedCountry);
    }
    if (selectedType) {
      filtered = filtered.filter(c => c.type === selectedType);
    }

    setResults(filtered);
  }, [query, selectedGenre, selectedCountry, selectedType]);

  const clearFilters = () => {
      setSelectedGenre(null);
      setSelectedCountry(null);
      setSelectedType(null);
      setQuery('');
  };

  return (
    <div className="pt-24 px-4 min-h-screen">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md leading-5 bg-abigray text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-gray-800 focus:border-abired transition duration-150 ease-in-out sm:text-sm"
          placeholder="Search movies, shows, actors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
             <Filter size={16} className="text-gray-400" />
             <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Filters</span>
             {(selectedGenre || selectedCountry || selectedType) && (
                 <button onClick={clearFilters} className="text-xs text-abired underline">Clear All</button>
             )}
        </div>
        
        <div className="flex flex-wrap gap-2">
           {/* Type Filter */}
           <select 
             className="bg-abigray text-white text-sm rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-abired"
             value={selectedType || ''}
             onChange={(e) => setSelectedType(e.target.value as ContentType || null)}
            >
             <option value="">All Types</option>
             <option value="movie">Movies</option>
             <option value="series">Series</option>
           </select>

           {/* Country Filter */}
           <select 
             className="bg-abigray text-white text-sm rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-abired"
             value={selectedCountry || ''}
             onChange={(e) => setSelectedCountry(e.target.value || null)}
            >
             <option value="">All Countries</option>
             {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
           </select>

           {/* Genre Filter */}
           <select 
             className="bg-abigray text-white text-sm rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-abired"
             value={selectedGenre || ''}
             onChange={(e) => setSelectedGenre(e.target.value || null)}
            >
             <option value="">All Genres</option>
             {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
        {results.length > 0 ? (
          results.map(item => (
            <div 
                key={item.id} 
                className="group relative cursor-pointer bg-abigray rounded-md overflow-hidden"
                onClick={() => setPlayingContent(item)}
            >
              <div className="aspect-[2/3] w-full relative">
                <img 
                    src={item.posterUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <Play className="text-white fill-white" size={32} />
                </div>
              </div>
              <div className="p-2">
                 <h3 className="text-sm font-medium truncate">{item.title}</h3>
                 <div className="flex items-center justify-between mt-1">
                     <span className="text-[10px] text-gray-400">{item.releaseYear}</span>
                     <span className="text-[10px] border border-gray-600 px-1 rounded text-gray-400">{item.type === 'movie' ? 'Movie' : 'TV'}</span>
                 </div>
              </div>
            </div>
          ))
        ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
                <p>No content found matching your criteria.</p>
            </div>
        )}
      </div>

      {playingContent && (
        <VideoPlayer 
          src={playingContent.videoUrl || playingContent.trailerUrl} 
          title={playingContent.title}
          poster={playingContent.bannerUrl}
          onClose={() => setPlayingContent(null)}
        />
      )}
    </div>
  );
};
