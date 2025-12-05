import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { Content, ContentType } from '../types';
import { Trash2, Edit2, Plus, Film, Users, TrendingUp, X, Search, Save, AlertTriangle, CheckCircle, Image as ImageIcon, Filter } from 'lucide-react';
import { COUNTRIES, GENRES } from '../constants';

// --- Types ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const AdminDashboard: React.FC = () => {
  const [contentList, setContentList] = useState<Content[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');
  
  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Partial<Content>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  // Notification State
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setContentList(db.getAllContent());
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // --- Handlers ---

  const handleOpenAdd = () => {
    setSelectedContent({ 
        type: 'movie', 
        genres: [], 
        country: 'USA',
        rating: 7.5,
        trending: false,
        posterUrl: `https://picsum.photos/300/450?random=${Date.now()}`,
        bannerUrl: `https://picsum.photos/1200/600?random=${Date.now()}`
    });
    setShowEditModal(true);
  };

  const handleOpenEdit = (content: Content) => {
    setSelectedContent({ ...content });
    setShowEditModal(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      db.deleteContent(deleteTargetId);
      addToast('Content deleted successfully', 'success');
      setDeleteTargetId(null);
      setShowDeleteModal(false);
      refreshData();
    }
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent.title) {
        addToast('Title is required', 'error');
        return;
    }

    const newItem: Content = {
      id: selectedContent.id || Date.now().toString(),
      title: selectedContent.title,
      description: selectedContent.description || '',
      type: selectedContent.type || 'movie',
      genres: selectedContent.genres || [],
      country: selectedContent.country || 'USA',
      releaseYear: selectedContent.releaseYear || new Date().getFullYear(),
      rating: selectedContent.rating || 0,
      posterUrl: selectedContent.posterUrl || '',
      bannerUrl: selectedContent.bannerUrl || '',
      videoUrl: selectedContent.videoUrl || '',
      trailerUrl: selectedContent.trailerUrl || '',
      cast: typeof selectedContent.cast === 'string' 
        ? (selectedContent.cast as string).split(',').map((s:string) => s.trim()) 
        : (selectedContent.cast || []),
      trending: selectedContent.trending || false,
      addedAt: selectedContent.addedAt || Date.now(),
      seasons: selectedContent.seasons || []
    };

    if (selectedContent.id) {
        db.updateContent(newItem);
        addToast('Content updated successfully', 'success');
    } else {
        db.addContent(newItem);
        addToast('New content added successfully', 'success');
    }
    
    setShowEditModal(false);
    refreshData();
  };

  // --- Helpers ---
  const filteredList = contentList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalMovies = contentList.filter(c => c.type === 'movie').length;
  const totalSeries = contentList.filter(c => c.type === 'series').length;

  return (
    <div className="pt-24 px-6 min-h-screen pb-20 relative">
      
      {/* Toast Notifications */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
            <div key={toast.id} className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded shadow-lg animate-fade-in ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your streaming library and users</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-abired hover:bg-red-700 text-white px-5 py-2.5 rounded-md flex items-center gap-2 transition font-bold shadow-lg shadow-abired/20">
            <Plus size={20} /> Add Content
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-abigray p-6 rounded-lg border border-white/5 flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Film size={28} /></div>
             <div>
                 <p className="text-gray-400 text-xs uppercase tracking-wider">Total Movies</p>
                 <p className="text-2xl font-bold text-white">{totalMovies}</p>
             </div>
         </div>
         <div className="bg-abigray p-6 rounded-lg border border-white/5 flex items-center gap-4">
             <div className="p-3 bg-purple-500/10 rounded-full text-purple-500"><Film size={28} /></div>
             <div>
                 <p className="text-gray-400 text-xs uppercase tracking-wider">Total Series</p>
                 <p className="text-2xl font-bold text-white">{totalSeries}</p>
             </div>
         </div>
         <div className="bg-abigray p-6 rounded-lg border border-white/5 flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-full text-green-500"><Users size={28} /></div>
             <div>
                 <p className="text-gray-400 text-xs uppercase tracking-wider">Active Users</p>
                 <p className="text-2xl font-bold text-white">1,245</p>
             </div>
         </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-abigray p-4 rounded-lg border border-white/5">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by title..." 
                className="w-full bg-black/30 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-abired focus:ring-1 focus:ring-abired"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
             <Filter size={18} className="text-gray-400" />
             <select 
                className="bg-black/30 border border-gray-700 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-abired"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
             >
                 <option value="all">All Types</option>
                 <option value="movie">Movies</option>
                 <option value="series">Series</option>
             </select>
         </div>
      </div>

      {/* Content Table */}
      <div className="bg-abigray rounded-lg overflow-hidden border border-white/5 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                    <tr>
                        <th className="p-4">Content</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Country</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredList.length > 0 ? filteredList.map(item => (
                        <tr key={item.id} className="hover:bg-white/5 transition group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                        <img src={item.posterUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.releaseYear} • {item.rating}/10</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${item.type === 'movie' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                                    {item.type}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-gray-400">{item.country}</td>
                            <td className="p-4 text-center">
                                {item.trending && <span className="inline-flex items-center gap-1 text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded-full"><TrendingUp size={12} /> Trending</span>}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenEdit(item)} 
                                        className="p-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-md transition"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenDelete(item.id)} 
                                        className="p-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-md transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                No content found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
             <div className="bg-abigray border border-white/10 w-full max-w-md p-6 rounded-lg shadow-2xl scale-100 animate-slide-up">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-abired">
                         <AlertTriangle size={24} />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-white">Delete Content?</h3>
                         <p className="text-gray-400 text-sm">This action cannot be undone.</p>
                     </div>
                 </div>
                 <p className="text-gray-300 mb-6">
                     Are you sure you want to delete <span className="text-white font-bold">{contentList.find(c => c.id === deleteTargetId)?.title}</span>? 
                     It will be removed from all user recommendations and lists.
                 </p>
                 <div className="flex gap-3 justify-end">
                     <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium transition"
                     >
                         Cancel
                     </button>
                     <button 
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 bg-abired hover:bg-red-700 rounded text-white font-medium transition flex items-center gap-2"
                     >
                         <Trash2 size={16} /> Delete Permanently
                     </button>
                 </div>
             </div>
        </div>
      )}

      {/* --- Edit/Add Modal --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-abigray border border-white/10 w-full max-w-4xl rounded-xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {selectedContent.id ? <Edit2 size={20} className="text-blue-500" /> : <Plus size={20} className="text-green-500" />}
                        {selectedContent.id ? 'Edit Content' : 'Add New Content'}
                    </h2>
                    <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="contentForm" onSubmit={handleSaveContent} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Media Preview */}
                        <div className="lg:col-span-1 space-y-6">
                             <div>
                                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Poster Preview</label>
                                 <div className="aspect-[2/3] bg-black/40 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center relative group">
                                     {selectedContent.posterUrl ? (
                                         <img src={selectedContent.posterUrl} alt="Poster" className="w-full h-full object-cover" />
                                     ) : (
                                         <div className="flex flex-col items-center text-gray-600">
                                             <ImageIcon size={32} />
                                             <span className="text-xs mt-2">No Image</span>
                                         </div>
                                     )}
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Banner Preview</label>
                                 <div className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                      {selectedContent.bannerUrl ? (
                                         <img src={selectedContent.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                                     ) : (
                                         <div className="flex flex-col items-center text-gray-600">
                                             <ImageIcon size={32} />
                                             <span className="text-xs mt-2">No Image</span>
                                         </div>
                                     )}
                                 </div>
                             </div>
                        </div>

                        {/* Right Column: Form Inputs */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title <span className="text-red-500">*</span></label>
                                    <input 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired focus:ring-1 focus:ring-abired outline-none" 
                                        value={selectedContent.title || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, title: e.target.value})} 
                                        placeholder="e.g. The Matrix"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                                    <select 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.type || 'movie'} 
                                        onChange={e => setSelectedContent({...selectedContent, type: e.target.value as ContentType})}
                                    >
                                        <option value="movie">Movie</option>
                                        <option value="series">Series</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea 
                                    className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                    rows={3} 
                                    value={selectedContent.description || ''} 
                                    onChange={e => setSelectedContent({...selectedContent, description: e.target.value})} 
                                    placeholder="Brief synopsis..."
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Country</label>
                                    <select 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.country || 'USA'} 
                                        onChange={e => setSelectedContent({...selectedContent, country: e.target.value})}
                                    >
                                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Year</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.releaseYear || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, releaseYear: parseInt(e.target.value)})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Rating (0-10)</label>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        max="10"
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.rating || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, rating: parseFloat(e.target.value)})} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Genres</label>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 bg-black/30 p-3 rounded border border-gray-700 max-h-32 overflow-y-auto">
                                    {GENRES.map(genre => (
                                        <label key={genre} className="flex items-center gap-2 cursor-pointer text-sm hover:text-white transition">
                                            <input 
                                                type="checkbox" 
                                                className="accent-abired"
                                                checked={selectedContent.genres?.includes(genre)}
                                                onChange={(e) => {
                                                    const currentGenres = selectedContent.genres || [];
                                                    if (e.target.checked) {
                                                        setSelectedContent({...selectedContent, genres: [...currentGenres, genre]});
                                                    } else {
                                                        setSelectedContent({...selectedContent, genres: currentGenres.filter(g => g !== genre)});
                                                    }
                                                }}
                                            />
                                            {genre}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cast (Comma separated)</label>
                                <input 
                                    className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                    value={Array.isArray(selectedContent.cast) ? selectedContent.cast.join(', ') : ''} 
                                    onChange={e => setSelectedContent({...selectedContent, cast: e.target.value.split(',')})} 
                                    placeholder="e.g. Actor One, Actor Two"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Video URL</label>
                                    <input 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.videoUrl || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, videoUrl: e.target.value})} 
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Trailer URL</label>
                                    <input 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.trailerUrl || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, trailerUrl: e.target.value})} 
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Poster Image URL</label>
                                    <input 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.posterUrl || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, posterUrl: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Banner Image URL</label>
                                    <input 
                                        className="w-full bg-black/30 border border-gray-700 p-2.5 rounded text-white focus:border-abired outline-none" 
                                        value={selectedContent.bannerUrl || ''} 
                                        onChange={e => setSelectedContent({...selectedContent, bannerUrl: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded border border-white/5 cursor-pointer" onClick={() => setSelectedContent({...selectedContent, trending: !selectedContent.trending})}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedContent.trending ? 'bg-abired border-abired' : 'border-gray-500'}`}>
                                    {selectedContent.trending && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <div>
                                    <span className="block font-medium text-white">Mark as Trending</span>
                                    <span className="text-xs text-gray-400">Feature this content on the home page carousel</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-abigray">
                    <button 
                        type="button" 
                        onClick={() => setShowEditModal(false)} 
                        className="px-6 py-3 bg-gray-700 rounded-md text-white font-bold hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="contentForm"
                        className="px-8 py-3 bg-abired rounded-md text-white font-bold hover:bg-red-700 transition flex items-center gap-2"
                    >
                        <Save size={18} /> {selectedContent.id ? 'Update Content' : 'Publish Content'}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
