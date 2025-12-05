import React from 'react';
import { Content } from '../types';
import { Play } from 'lucide-react';

interface ContentRowProps {
  title: string;
  items: Content[];
  onSelect: (content: Content) => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({ title, items, onSelect }) => {
  return (
    <div className="py-6 pl-4 md:pl-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 hover:text-abired transition-colors cursor-pointer">
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 pr-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex-none w-36 md:w-56 group relative cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => onSelect(item)}
          >
            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-abigray">
              <img 
                src={item.posterUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-abired rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Play size={20} className="fill-white text-white ml-1" />
                </div>
              </div>
            </div>
            <div className="mt-2">
               <h3 className="text-sm md:text-base font-medium truncate">{item.title}</h3>
               <p className="text-xs text-gray-400">{item.releaseYear} • {item.type === 'movie' ? 'Movie' : 'Series'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
