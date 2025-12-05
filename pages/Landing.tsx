import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, X, Monitor, Download, Globe } from 'lucide-react';

const AccordionItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#2d2d2d] hover:bg-[#414141] transition p-6 flex justify-between items-center text-lg md:text-2xl font-medium"
      >
        <span>{question}</span>
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
      {isOpen && (
        <div className="bg-[#2d2d2d] border-t border-black p-6 text-lg md:text-xl text-left">
          {answer}
        </div>
      )}
    </div>
  );
};

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate('/browse');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative border-b-8 border-[#232323]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg" 
            alt="background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[70vh] px-4 pt-20 pb-12">
           <h1 className="text-4xl md:text-6xl font-black max-w-4xl mb-6 leading-tight">
             Unlimited movies, TV shows, and more.
           </h1>
           <p className="text-xl md:text-2xl mb-8">Watch anywhere. Cancel anytime.</p>
           <p className="text-lg md:text-xl mb-4">Ready to watch? Enter your email to create or restart your membership.</p>
           
           <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-4 w-full max-w-3xl">
             <div className="flex-1 relative">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full h-14 md:h-16 px-6 pt-1 rounded bg-black/60 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
             </div>
             <button type="submit" className="bg-abired hover:bg-red-700 text-white text-xl md:text-2xl font-bold px-8 py-3 md:py-4 rounded flex items-center justify-center gap-2 transition">
               Get Started <ChevronRight />
             </button>
           </form>
        </div>
      </div>

      {/* Feature 1 */}
      <div className="bg-black py-16 md:py-24 px-6 border-b-8 border-[#232323]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-black mb-4">Enjoy on your TV.</h2>
             <p className="text-xl md:text-2xl font-light">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
           </div>
           <div className="flex-1 relative">
              <div className="relative z-10">
                  <Monitor size={300} strokeWidth={1} className="mx-auto text-[#333]" />
                  {/* Simulate screen content */}
                  <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[25%] bg-black flex items-center justify-center overflow-hidden">
                       <img src="https://picsum.photos/600/400?random=1" className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-abired font-black tracking-widest text-2xl">ABIFLIX</span>
                       </div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="bg-black py-16 md:py-24 px-6 border-b-8 border-[#232323]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
           <div className="flex-1 text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-black mb-4">Download your shows to watch offline.</h2>
             <p className="text-xl md:text-2xl font-light">Save your favorites easily and always have something to watch.</p>
           </div>
           <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                 <img src="https://picsum.photos/400/550?random=2" className="w-full rounded-xl border-4 border-[#333]" />
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black border border-[#555] rounded-xl flex items-center gap-4 p-3 w-[80%] shadow-2xl">
                    <img src="https://picsum.photos/50/70?random=2" className="h-12 w-8 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                       <div className="font-bold text-sm truncate">Seoul Nights</div>
                       <div className="text-blue-500 text-xs">Downloading...</div>
                    </div>
                    <Download className="animate-bounce text-white" size={20} />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="bg-black py-16 md:py-24 px-6 border-b-8 border-[#232323]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-black mb-4">Watch everywhere.</h2>
             <p className="text-xl md:text-2xl font-light">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
           </div>
           <div className="flex-1 relative">
                <div className="bg-[#111] aspect-video rounded-lg flex items-center justify-center border border-[#333]">
                     <span className="text-gray-500 text-lg">Cross-platform Streaming</span>
                </div>
           </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-black py-16 md:py-24 px-6 border-b-8 border-[#232323]">
         <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl md:text-5xl font-black mb-12">Frequently Asked Questions</h2>
             <div className="mb-12">
                 <AccordionItem question="What is Abiflix?" answer="Abiflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices." />
                 <AccordionItem question="How much does Abiflix cost?" answer="Watch Abiflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $17.99 a month. No extra costs, no contracts." />
                 <AccordionItem question="Where can I watch?" answer="Watch anywhere, anytime. Sign in with your Abiflix account to watch instantly on the web at abiflix.com from your personal computer or on any internet-connected device that offers the Abiflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles." />
                 <AccordionItem question="How do I cancel?" answer="Abiflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime." />
             </div>
             
             <p className="text-lg md:text-xl mb-4">Ready to watch? Enter your email to create or restart your membership.</p>
             <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-4 w-full max-w-3xl mx-auto">
                <div className="flex-1 relative">
                    <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full h-14 md:h-16 px-6 pt-1 rounded bg-black/60 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <button type="submit" className="bg-abired hover:bg-red-700 text-white text-xl md:text-2xl font-bold px-8 py-3 md:py-4 rounded flex items-center justify-center gap-2 transition">
                Get Started <ChevronRight />
                </button>
            </form>
         </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-16 px-6 text-[#737373] text-sm md:text-base">
         <div className="max-w-5xl mx-auto">
             <p className="mb-8">Questions? Call 1-800-000-0000</p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <a href="#" className="hover:underline">FAQ</a>
                 <a href="#" className="hover:underline">Help Center</a>
                 <a href="#" className="hover:underline">Account</a>
                 <a href="#" className="hover:underline">Media Center</a>
                 <a href="#" className="hover:underline">Investor Relations</a>
                 <a href="#" className="hover:underline">Jobs</a>
                 <a href="#" className="hover:underline">Ways to Watch</a>
                 <a href="#" className="hover:underline">Terms of Use</a>
                 <a href="#" className="hover:underline">Privacy</a>
                 <a href="#" className="hover:underline">Cookie Preferences</a>
                 <a href="#" className="hover:underline">Corporate Information</a>
                 <a href="#" className="hover:underline">Contact Us</a>
                 <a href="#" className="hover:underline">Speed Test</a>
                 <a href="#" className="hover:underline">Legal Notices</a>
                 <a href="#" className="hover:underline">Only on Abiflix</a>
             </div>
             <div className="mb-6">
                 <button className="flex items-center gap-2 border border-[#737373] px-4 py-2 rounded text-sm hover:text-white transition">
                     <Globe size={16} /> English
                 </button>
             </div>
             <p>Abiflix Global</p>
         </div>
      </div>
    </div>
  );
};