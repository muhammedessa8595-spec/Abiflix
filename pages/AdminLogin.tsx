import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/storage';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('abew');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = db.loginAdmin(identifier, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg" 
          alt="background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Logo Top Left */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-1">
         <div className="text-abired font-black text-4xl tracking-tighter drop-shadow-lg">AF</div>
         <div className="hidden md:block font-bold text-2xl tracking-wide text-white drop-shadow-lg">ABIFLIX</div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[450px] px-4">
        <div className="bg-black/75 backdrop-blur-sm p-8 md:p-16 rounded-xl border border-white/10 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>
          
          {error && (
            <div className="bg-[#e87c03] p-3 rounded text-sm text-white mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
               <input 
                 type="text" 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 className="w-full bg-[#333] text-white rounded px-4 pt-6 pb-2 focus:outline-none focus:bg-[#454545] border-none peer placeholder-transparent"
                 placeholder="Username"
                 required
               />
               <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-200">
                 Username or Email
               </label>
            </div>

            <div className="relative">
               <input 
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-[#333] text-white rounded px-4 pt-6 pb-2 focus:outline-none focus:bg-[#454545] border-none peer placeholder-transparent"
                 placeholder="Password"
                 required
               />
               <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-200">
                 Password
               </label>
               <button 
                 type="button" 
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-4 text-gray-400 hover:text-white"
               >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-abired hover:bg-red-700 text-white font-bold py-3 rounded mt-6 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="flex justify-between items-center text-sm text-[#b3b3b3] mt-2">
               <div className="flex items-center gap-1">
                 <input type="checkbox" id="remember" className="rounded bg-[#333] border-none focus:ring-0" />
                 <label htmlFor="remember">Remember me</label>
               </div>
               <button type="button" className="hover:underline hover:text-white">Need help?</button>
            </div>
          </form>

          <div className="mt-16 text-[#737373]">
            <p className="mb-4">
              New to Abiflix? <button className="text-white hover:underline ml-1">Sign up now.</button>
            </p>
            <p className="text-xs">
              This page is protected by Google reCAPTCHA to ensure you're not a bot. <button className="text-blue-500 hover:underline">Learn more.</button>
            </p>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-4">
            <p className="text-xs text-center text-gray-500">
                Demo Credentials: <span className="text-gray-300">abew</span> / <span className="text-gray-300">488055</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};