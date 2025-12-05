import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Play, Plus, Check } from 'lucide-react';
import { createChatSession, sendMessageToAI } from '../services/gemini';
import { ChatMessage, Content } from '../types';
import { Chat } from "@google/genai";
import { db } from '../services/storage';
import { VideoPlayer } from '../components/VideoPlayer';

// Sub-component for individual recommendation card
const RecommendationCard: React.FC<{ content: Content; onPlay: (c: Content) => void }> = ({ content, onPlay }) => {
  const [inWatchlist, setInWatchlist] = useState(db.getUser().watchlist.includes(content.id));

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    db.toggleWatchlist(content.id);
    setInWatchlist(!inWatchlist);
  };

  return (
    <div className="flex-none w-36 md:w-44 flex flex-col gap-2 bg-black/20 rounded-lg p-2">
      <div 
        className="relative aspect-[2/3] rounded-md overflow-hidden group cursor-pointer" 
        onClick={() => onPlay(content)}
      >
        <img src={content.posterUrl} alt={content.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="bg-abired rounded-full p-2">
            <Play className="text-white fill-white" size={16} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold truncate text-white">{content.title}</span>
        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={() => onPlay(content)}
            className="flex-1 text-[10px] bg-white text-black py-1.5 rounded font-bold hover:bg-gray-200 flex items-center justify-center gap-1"
          >
            <Play size={10} fill="currentColor" /> Play
          </button>
          <button 
            onClick={handleToggleWatchlist}
            className={`p-1.5 rounded border ${inWatchlist ? 'bg-gray-600 border-gray-600 text-white' : 'border-gray-500 text-gray-400 hover:text-white'}`}
            title={inWatchlist ? "Remove from List" : "Add to List"}
          >
            {inWatchlist ? <Check size={12} /> : <Plus size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am Abiflix AI. I can help you find the perfect movie or series to watch. What are you in the mood for today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    const session = createChatSession();
    if (session) {
      chatSessionRef.current = session;
    } else {
        setMessages(prev => [...prev, {
            id: 'error-init',
            role: 'model',
            text: 'Warning: API Key not configured. AI features are unavailable.',
            timestamp: Date.now()
        }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const rawResponse = await sendMessageToAI(chatSessionRef.current, userMsg.text);

    // Parse recommendations
    const recommendationRegex = /\[\[RECOMMENDED:(.*?)\]\]/;
    const match = rawResponse.match(recommendationRegex);
    let cleanText = rawResponse;
    let recommendedIds: string[] = [];

    if (match) {
        try {
            recommendedIds = JSON.parse(match[1]);
            cleanText = rawResponse.replace(match[0], '').trim();
        } catch (e) {
            console.error("Failed to parse recommendations", e);
        }
    }

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: cleanText,
      timestamp: Date.now(),
      recommendedContentIds: recommendedIds
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    db.addToHistory(content.id);
  };

  return (
    <div className="pt-20 h-screen flex flex-col max-w-4xl mx-auto px-4 pb-20 md:pb-4">
      <div className="flex-1 overflow-y-auto space-y-6 mb-4 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-abired' : 'bg-gray-600'}`}>
               {msg.role === 'model' ? <Bot size={16} className="text-white" /> : <UserIcon size={16} className="text-white" />}
            </div>
            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-abigray text-gray-100 rounded-tl-none'}`}>
                   <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                {/* Render Recommendations if any */}
                {msg.role === 'model' && msg.recommendedContentIds && msg.recommendedContentIds.length > 0 && (
                  <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                     <div className="flex gap-3">
                        {msg.recommendedContentIds.map(id => {
                            const content = db.getContentById(id);
                            if (!content) return null;
                            return (
                                <RecommendationCard 
                                    key={id} 
                                    content={content} 
                                    onPlay={handlePlay} 
                                />
                            );
                        })}
                     </div>
                  </div>
                )}
            </div>
          </div>
        ))}
        
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-abired flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                </div>
                <div className="bg-abigray p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask for recommendations..."
          className="w-full bg-abigray text-white rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-abired"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 p-2 bg-abired rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition"
        >
          <Send size={20} />
        </button>
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