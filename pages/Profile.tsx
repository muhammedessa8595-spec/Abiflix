import React from 'react';
import { db } from '../services/storage';
import { User, LogOut, Settings, CreditCard, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const user = db.getUser();
  const watchlist = db.getAllContent().filter(c => user.watchlist.includes(c.id));
  const history = db.getAllContent().filter(c => user.history.includes(c.id));

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto min-h-screen">
       <div className="flex flex-col items-center mb-10">
           <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 border-2 border-abired" />
           <h1 className="text-2xl font-bold">{user.name}</h1>
           <p className="text-gray-400">{user.email}</p>
           
           {user.isAdmin ? (
               <Link to="/admin" className="mt-4 flex items-center gap-2 bg-abigray px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition">
                   <Shield size={16} className="text-abired" />
                   Admin Dashboard
               </Link>
           ) : (
               <Link to="/admin/login" className="mt-4 flex items-center gap-2 bg-abigray px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition">
                   <Lock size={16} className="text-gray-400" />
                   Admin Login
               </Link>
           )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-abigray p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={20} /> Subscription</h3>
                <p className="text-sm text-gray-400 mb-2">Plan: <span className="text-white font-bold">Premium 4K</span></p>
                <p className="text-sm text-gray-400">Next billing: <span className="text-white">Oct 24, 2025</span></p>
                <button className="mt-4 text-sm text-abired hover:underline">Manage Subscription</button>
            </div>
             <div className="bg-abigray p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings size={20} /> Settings</h3>
                <div className="space-y-3">
                    <button className="w-full text-left text-sm text-gray-300 hover:text-white flex justify-between">App Settings <span>&gt;</span></button>
                    <button className="w-full text-left text-sm text-gray-300 hover:text-white flex justify-between">Account <span>&gt;</span></button>
                    <button className="w-full text-left text-sm text-gray-300 hover:text-white flex justify-between">Help Center <span>&gt;</span></button>
                    <button className="w-full text-left text-sm text-red-500 hover:text-red-400 flex items-center gap-2"><LogOut size={16} /> Sign Out</button>
                </div>
            </div>
       </div>

       <div className="mb-10">
           <h2 className="text-xl font-bold mb-4">My List</h2>
           {watchlist.length > 0 ? (
               <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                   {watchlist.map(item => (
                       <div key={item.id} className="relative aspect-[2/3] rounded overflow-hidden">
                           <img src={item.posterUrl} className="w-full h-full object-cover" />
                       </div>
                   ))}
               </div>
           ) : (
               <p className="text-gray-500 text-sm">Your watchlist is empty.</p>
           )}
       </div>

        <div className="mb-20">
           <h2 className="text-xl font-bold mb-4">Watch History</h2>
           {history.length > 0 ? (
               <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                   {history.map(item => (
                       <div key={item.id} className="relative aspect-[2/3] rounded overflow-hidden opacity-80">
                           <img src={item.posterUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition" />
                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>
                       </div>
                   ))}
               </div>
           ) : (
               <p className="text-gray-500 text-sm">No watch history yet.</p>
           )}
       </div>
    </div>
  );
};