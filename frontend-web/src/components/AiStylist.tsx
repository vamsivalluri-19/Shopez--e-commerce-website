import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Ruler, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { resolveAssetUrl } from '../utils/assetUrl';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: any[];
}

export default function AiStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your ShopEZ AI Personal Stylist. Let me help you find the perfect outfit, suggest style matchings, or calculate your recommended size. What are you looking for today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSizeCalc, setShowSizeCalc] = useState(false);
  
  // Size Recommender State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fit, setFit] = useState<'slim' | 'regular' | 'loose'>('regular');
  const [sizeResult, setSizeResult] = useState<string | null>(null);
  const [sizeExplanation, setSizeExplanation] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showSizeCalc]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { message: input });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.data.reply,
        products: res.data.products
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Local Fallback if API fails
      const text = input.toLowerCase();
      let reply = "I couldn't reach the server, but as a local backup stylist: I suggest checking out our Elegant Women's Tunic Dress or Men's Casual Cotton Shirt with AeroKnit Trainers.";
      if (text.includes('shoe') || text.includes('sneaker')) {
        reply = "AeroKnit Cushioned Trainers are wonderful for both comfort and performance. Our trainers are highly recommended!";
      } else if (text.includes('size')) {
        reply = "Try using the Size Calculator tool in the header to compute your recommended size!";
      }
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return;
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/size-recommend', { height, weight, fit });
      setSizeResult(res.data.recommendedSize);
      setSizeExplanation(res.data.explanation);
      
      // Post to chat automatically
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          text: `Calculate size: Height ${height}cm, Weight ${weight}kg, ${fit} fit.`
        },
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `My recommendation is Size ${res.data.recommendedSize}. ${res.data.explanation}`
        }
      ]);
      setShowSizeCalc(false);
    } catch (err) {
      setSizeResult('M');
      setSizeExplanation('Calculation fallback completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Sparkly Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-800 dark:border-neutral-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
      </motion.button>

      {/* Floating Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] rounded-2xl glass-card flex flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800/80"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-luxury-charcoal dark:bg-neutral-900 border-b border-neutral-800/50 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-luxury-gold" />
                <div>
                  <h3 className="font-semibold text-sm tracking-wide">SHAPEZ AI STYLIST</h3>
                  <span className="text-[10px] text-neutral-400">Online & Ready to Guide</span>
                </div>
              </div>
              <button 
                onClick={() => setShowSizeCalc(!showSizeCalc)}
                className={`p-1.5 rounded-lg border transition-all ${
                  showSizeCalc 
                    ? 'bg-luxury-gold text-luxury-charcoal border-luxury-gold' 
                    : 'border-neutral-700 text-neutral-400 hover:text-white'
                }`}
                title="AI Size Recommender"
              >
                <Ruler className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body & Size Calc Overlay */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative bg-white/40 dark:bg-black/30">
              {showSizeCalc ? (
                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleCalculateSize}
                  className="bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 dark:text-luxury-gold">
                      <Ruler className="w-3.5 h-3.5" /> AI Size Recommendation
                    </h4>
                    <button type="button" onClick={() => setShowSizeCalc(false)} className="text-neutral-400 hover:text-neutral-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-500 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 175"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-500 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 70"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-500 mb-1">Preferred Fit</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['slim', 'regular', 'loose'] as const).map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFit(f)}
                          className={`py-1.5 text-xs capitalize border transition-all ${
                            fit === f 
                              ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' 
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
                  >
                    {loading ? 'Analyzing...' : 'Get Size Recommendation'}
                  </button>
                </motion.form>
              ) : (
                <>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-luxury-charcoal text-white dark:bg-luxury-gold dark:text-luxury-charcoal'
                            : 'bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        
                        {/* Display recommended products if any */}
                        {msg.products && msg.products.length > 0 && (
                          <div className="mt-3 space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-luxury-gold" /> Recommended Fits:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {msg.products.map((p: any) => (
                                <div key={p._id} className="bg-neutral-50 dark:bg-neutral-950 p-1.5 border border-neutral-100 dark:border-neutral-800">
                                  <img src={resolveAssetUrl(p.images[0])} alt={p.name} className="w-full h-16 object-cover mb-1" />
                                  <div className="text-[10px] font-semibold truncate">{p.name}</div>
                                  <div className="text-[10px] text-luxury-gold">${p.price}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl px-4 py-2 text-xs text-neutral-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask your stylist anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading || showSizeCalc}
                className="flex-1 px-3 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-luxury-gold"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || showSizeCalc}
                className="p-2.5 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
