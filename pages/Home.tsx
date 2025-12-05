import React, { useState, useEffect } from 'react';
import { Content } from '../types';
import { db } from '../services/storage';
import { ContentRow } from '../components/ContentRow';
import { VideoPlayer } from '../components/VideoPlayer';
import { Play, Info, Plus, Check } from 'lucide-react';

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Content | null>(null);
  const [trending, setTrending] = useState<Content[]>([]);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [watchlist, setWatchlist] = useState<Content[]>([]);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [user] = useState(db.getUser());
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const all = db.getAllContent();
    const trend = db.getTrending();
    setTrending(trend);
    setMovies(all.filter(c => c.type === 'movie'));
    setSeries(all.filter(c => c.type === 'series'));
    
    // Set random featured
    if (trend.length > 0) {
      setFeatured(trend[Math.floor(Math.random() * trend.length)]);
    }

    // Load watchlist
    const userWatchlistIds = user.watchlist;
    setWatchlist(all.filter(c => userWatchlistIds.includes(c.id)));
  }, [user]);

  useEffect(() => {
    if (featured) {
        setInWatchlist(user.watchlist.includes(featured.id));
    }
  }, [featured, user.watchlist]);

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    db.addToHistory(content.id);
  };

  const toggleWatchlist = (e: React.MouseEvent, content: Content) => {
    e.stopPropagation();
    db.toggleWatchlist(content.id);
    setInWatchlist(!inWatchlist);
    // Refresh local watchlist state for rows
    const all = db.getAllContent();
    const updatedUser = db.getUser();
    setWatchlist(all.filter(c => updatedUser.watchlist.includes(c.id)));
  };

  if (!featured) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="pb-20">
      {/* Hero Banner */}
      <div className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={featured.bannerUrl} 
            alt={featured.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4 z-10">
          <div className="flex flex-wrap gap-2 mb-2">
            {featured.genres.map(g => (
                <span key={g} className="text-xs font-bold text-white bg-abired/80 px-2 py-1 rounded uppercase tracking-wider">{g}</span>
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white drop-shadow-lg">
            {featured.title}
          </h1>
          <p className="text-gray-200 text-sm md:text-lg line-clamp-3 md:line-clamp-none drop-shadow-md">
            {featured.description}
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <button 
                onClick={() => handlePlay(featured)}
                className="bg-white text-black px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-opacity-90 transition"
            >
              <Play size={24} fill="currentColor" /> Play
            </button>
            <button 
                onClick={(e) => toggleWatchlist(e, featured)}
                className="bg-gray-600/80 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-gray-600 transition"
            >
              {inWatchlist ? <Check size={24} /> : <Plus size={24} />}
              {inWatchlist ? 'My List' : 'Add to List'}
            </button>
             <button className="bg-gray-600/80 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-gray-600 transition hidden md:flex">
              <Info size={24} /> Info
            </button>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="-mt-20 relative z-20 space-y-4">
        <ContentRow title="Trending Now" items={trending} onSelect={handlePlay} />
        {watchlist.length > 0 && <ContentRow title="My List" items={watchlist} onSelect={handlePlay} />}
        <ContentRow title="Movies" items={movies} onSelect={handlePlay} />
        <ContentRow title="TV Series" items={series} onSelect={handlePlay} />
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
