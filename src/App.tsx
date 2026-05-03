/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dice5, History, RotateCcw, Volume2, VolumeX, ShieldQuestion, Flame, Zap } from 'lucide-react';

type Category = 'truth' | 'dare' | 'chaos';

interface Prompt {
  id: number;
  text: string;
  category: Category;
}

const PROMPTS: Prompt[] = [
  // Truths
  { id: 1, category: 'truth', text: "What's the most embarrassing thing you've done in public?" },
  { id: 2, category: 'truth', text: "Who was your first crush?" },
  { id: 3, category: 'truth', text: "What's a secret you've never told anyone here?" },
  { id: 4, category: 'truth', text: "What's the biggest lie you've ever told?" },
  { id: 5, category: 'truth', text: "What's your most useless talent?" },
  { id: 6, category: 'truth', text: "If you could swap lives with someone for a day, who would it be?" },
  { id: 7, category: 'truth', text: "What's the weirdest dream you've ever had?" },
  { id: 8, category: 'truth', text: "What's your biggest fear?" },
  
  // Dares
  { id: 101, category: 'dare', text: "Do your best impression of someone in the room." },
  { id: 102, category: 'dare', text: "Dance with no music for one minute." },
  { id: 103, category: 'dare', text: "Let someone else send a text to anyone in your contacts using your phone." },
  { id: 104, category: 'dare', text: "Try to lick your elbow." },
  { id: 105, category: 'dare', text: "Sing the chorus of a popular song at the top of your lungs." },
  { id: 106, category: 'dare', text: "Show the most recent photo in your gallery." },
  { id: 107, category: 'dare', text: "Talk in an accent chosen by the group for 3 rounds." },
  { id: 108, category: 'dare', text: "Do 20 pushups right now." },

  // Chaos
  { id: 201, category: 'chaos', text: "Everyone must switch clothes with the person to their left (just one item!)." },
  { id: 202, category: 'chaos', text: "The next person to speak must do a dare chosen by the AI (everyone else picks)." },
  { id: 203, category: 'chaos', text: "Everyone must talk in slow motion until the next turn." },
  { id: 204, category: 'chaos', text: "Switch seats with someone else randomly chosen." },
  { id: 205, category: 'chaos', text: "For the next 5 minutes, you can only whisper." },
  { id: 206, category: 'chaos', text: "The person to your right gets to post anything on your social media story." },
  { id: 207, category: 'chaos', text: "Freeze! Everyone stays still until someone laughs. First one to laugh does 2 dares." },
  { id: 208, category: 'chaos', text: "Order is now reversed. Go counter-clockwise." },
  { id: 209, category: 'chaos', text: "Everyone must trade one shoe with someone else for the rest of the game." },
  { id: 210, category: 'chaos', text: "Robot Mode: Everyone must act and speak like a robot until your next turn." },
  { id: 211, category: 'chaos', text: "The Floor is Lava! Anyone who touches the floor in the next 3 minutes must do 10 squats." },
  { id: 212, category: 'chaos', text: "Animal Kingdom: The group chooses an animal for you. You must make its sound before every sentence." },
  { id: 213, category: 'chaos', text: "Prop Swap: Everyone must find an object in the room and keep it in their hands for 3 rounds." },
];

const COLORS = {
  bg: 'bg-neo-bg',
  text: 'text-neo-text',
  truth: {
    bg: 'bg-neo-bg',
    accent: 'text-truth',
    shadow: 'neo-raised',
    active: 'neo-inset',
  },
  dare: {
    bg: 'bg-neo-bg',
    accent: 'text-dare',
    shadow: 'neo-raised',
    active: 'neo-inset',
  },
  chaos: {
    bg: 'bg-chaos-bg',
    accent: 'text-chaos',
    shadow: 'neo-raised',
    active: 'neo-inset',
  },
};

export default function App() {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [history, setHistory] = useState<Prompt[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const getNewPrompt = useCallback((category: Category) => {
    const filtered = PROMPTS.filter(p => p.category === category);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selected = filtered[randomIndex];
    
    if (currentPrompt) {
      setHistory(prev => [currentPrompt, ...prev].slice(0, 5));
    }
    
    setCurrentPrompt(selected);
    setActiveCategory(category);
  }, [currentPrompt]);

  const resetGame = () => {
    setCurrentPrompt(null);
    setHistory([]);
    setActiveCategory(null);
  };

  return (
    <div className={`min-h-screen ${COLORS.bg} ${COLORS.text} font-sans p-6 md:p-12 flex flex-col items-center justify-between transition-colors duration-500`}>
      {/* Header */}
      <header className="w-full max-w-5xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="neo-raised px-8 py-4 rounded-[30px] flex items-center gap-3">
          <Sparkles className="text-chaos w-6 h-6 animate-pulse" />
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            REVEAL <span className="text-gray-400">&</span> RISK
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="neo-raised px-6 py-3 rounded-[20px] flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${activeCategory ? 'bg-green-400' : 'bg-gray-300'}`} />
            <span className="font-bold text-sm">Mode: {activeCategory || 'Idle'}</span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-[15px] neo-raised flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            id="mute-button"
          >
            {isMuted ? <VolumeX className="w-5 h-5 opacity-40" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={resetGame}
            className="w-12 h-12 rounded-[15px] neo-raised flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-red-400"
            id="reset-button"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center gap-10 my-8">
        <AnimatePresence mode="wait">
          {currentPrompt ? (
            <motion.div
              key={currentPrompt.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={`relative overflow-hidden neo-raised rounded-[40px] p-10 md:p-20 w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center text-center
                ${activeCategory === 'chaos' ? 'bg-chaos-bg' : 'bg-neo-bg'}
              `}
              id="prompt-card"
            >
              <div className={`neo-inset w-24 h-24 flex items-center justify-center mb-8 rounded-[30px] ${activeCategory ? COLORS[activeCategory].accent : ''}`}>
                {activeCategory === 'truth' && <ShieldQuestion size={48} />}
                {activeCategory === 'dare' && <Flame size={48} />}
                {activeCategory === 'chaos' && <Zap size={48} />}
              </div>

              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm uppercase tracking-[0.3em] font-black mb-6 ${activeCategory ? COLORS[activeCategory].accent : 'text-gray-400'}`}
              >
                {activeCategory}
              </motion.span>
              
              <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                {currentPrompt.text}
              </h2>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="neo-raised rounded-[40px] p-12 w-full max-w-2xl flex flex-col items-center text-center justify-center min-h-[400px]"
              id="welcome-card"
            >
              <div className="neo-inset w-32 h-32 rounded-full flex items-center justify-center mb-10">
                <Dice5 className="w-16 h-16 text-chaos opacity-30" />
              </div>
              <h2 className="text-4xl font-black mb-4">CHOOSE YOUR FATE</h2>
              <p className="text-lg text-gray-500 max-w-md font-medium">
                Select a category below to reveal your first challenge. Chaos mode is always unpredictable.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {!currentPrompt && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <CategoryCard 
              label="Truth" 
              desc="Reveal secrets for 50 pts"
              icon={<ShieldQuestion size={32} />} 
              accent="text-truth"
              onClick={() => getNewPrompt('truth')}
            />
            <CategoryCard 
              label="Dare" 
              desc="Take risks for 100 pts"
              icon={<Flame size={32} />} 
              accent="text-dare"
              onClick={() => getNewPrompt('dare')}
            />
            <CategoryCard 
              label="Chaos" 
              desc="Unfiltered madness"
              icon={<Zap size={32} />} 
              accent="text-chaos"
              onClick={() => getNewPrompt('chaos')}
              isChaos
            />
          </div>
        )}
      </main>

      {/* Footer / Chaos & History */}
      <footer className="w-full max-w-5xl mt-8">
        <section className={`neo-inset rounded-[30px] p-8 flex flex-col md:flex-row items-center gap-10 ${activeCategory === 'chaos' ? 'bg-chaos-bg' : ''}`}>
          <div className="flex flex-col shrink-0">
            <h3 className="text-2xl font-black text-chaos uppercase tracking-widest flex items-center gap-3">
              <span className="text-3xl">⚡</span> CHAOS SECTION
            </h3>
            <p className="text-sm font-bold text-chaos opacity-50 uppercase tracking-tighter">History & Active Events</p>
          </div>
          
          <div className="flex-1 flex gap-4 overflow-hidden w-full">
            {history.length > 0 ? (
              history.map((h, i) => (
                <div key={`${h.id}-${i}`} className="neo-raised bg-white/40 p-5 rounded-[20px] min-w-[280px] border border-white/20 flex flex-col justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${COLORS[h.category].accent}`}>{h.category}</span>
                  <p className="text-sm font-semibold truncate italic">"{h.text}"</p>
                </div>
              ))
            ) : (
              <div className="neo-raised bg-white/40 p-5 rounded-[20px] w-full border border-white/20 opacity-50 flex items-center justify-center">
                <span className="text-sm font-black uppercase tracking-widest italic tracking-tighter">Waiting for the first move...</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => getNewPrompt(activeCategory || 'truth')}
            className={`neo-raised h-16 px-10 text-lg font-black rounded-[20px] shrink-0 transition-all active:scale-95
              ${activeCategory ? COLORS[activeCategory].accent : 'text-gray-400'}
            `}
          >
            NEXT CARD
          </button>
        </section>
      </footer>
    </div>
  );
}

function CategoryCard({ 
  label, 
  desc,
  icon, 
  accent,
  onClick,
  isChaos 
}: { 
  label: string; 
  desc: string;
  icon: React.ReactNode; 
  accent: string;
  onClick: () => void;
  isChaos?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        neo-raised rounded-[35px] p-8 flex flex-col items-center text-center gap-4 group transition-all hover:-translate-y-2
        ${isChaos ? 'bg-chaos-bg/30' : ''}
      `}
    >
      <div className={`neo-inset w-16 h-16 rounded-[15px] flex items-center justify-center ${accent} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className={`text-2xl font-black ${accent}`}>{label}</h3>
        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{desc}</p>
      </div>
      <div className="neo-raised px-6 py-2 rounded-full mt-2 text-xs font-black group-hover:text-neo-text transition-colors">
        SELECT
      </div>
    </button>
  );
}
