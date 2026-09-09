import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Dumbbell } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hey! I'm your SHREX fitness assistant. What are you training for today?",
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'WhatsApp / Call',
    'Build Strength',
    'Gym Membership',
    'Workout Plan',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputVal.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // Simulate intelligent bot reply after 1 sec delay
    setTimeout(() => {
      let botResponse = "I'd love to assist you with that! SHREX CLUB offers world-class coaching and power lifting platforms. How else can I help your training?";

      const lower = query.toLowerCase();
      if (lower.includes('whatsapp') || lower.includes('contact') || lower.includes('call') || lower.includes('phone') || lower.includes('instagram') || lower.includes('gmail') || lower.includes('email')) {
        botResponse = "You can connect directly with us right away:\n• WhatsApp / Call: +91 90144 04462\n• Instagram: @Shreyas__.2008\n• Gmail: Shreyaskura@gmail.com\nFeel free to tap the WhatsApp card in the Contact section!";
      } else if (lower.includes('strength') || lower.includes('build')) {
        botResponse = "For raw power and hypertrophy, I recommend our 'STRENGTH TRAINING' protocol or 1-on-1 coaching with Head Trainer Arjun Sharma!";
      } else if (lower.includes('membership') || lower.includes('price')) {
        botResponse = "Our memberships start at ₹1,499/mo for Essential, ₹2,999/mo for Performance (Most Popular), and ₹5,999/mo for Elite VIP!";
      } else if (lower.includes('workout') || lower.includes('plan')) {
        botResponse = "Check out our interactive Target Muscle Map on this page! You can select Chest, Arms, or Legs to view custom set & rep breakdowns.";
      } else if (lower.includes('fitness') || lower.includes('cardio')) {
        botResponse = "Our High-Octane Cardio Arena features curved Woodway treadmills and real-time heart rate LED telemetry walls!";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-[999]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group p-4 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-red-400 text-white shadow-[0_0_30px_rgba(229,9,20,0.6)] flex items-center justify-center cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <span className="absolute -inset-1 rounded-full bg-red-600 blur-md opacity-50 group-hover:opacity-100 animate-pulse -z-10" />
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Glassmorphic Chat Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 sm:right-8 z-[999] w-[92vw] sm:w-[380px] h-[520px] rounded-3xl glass-panel border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden bg-[#0A0A0F]/90 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-950/80 to-transparent border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-black text-sm text-white flex items-center gap-1.5">
                    SHREX AI ASSISTANT
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    ONLINE • REAL-TIME AI
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-red-600 text-white rounded-br-none border border-red-400/40 shadow-md'
                        : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/10 backdrop-blur-md'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] font-mono opacity-60 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-2xl w-fit border border-white/10">
                  <Bot className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                  <span>SHREX AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Option Prompts Chips */}
            <div className="px-4 py-2 border-t border-white/10 flex gap-2 overflow-x-auto scrollbar-none">
              {quickPrompts.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-red-600/30 hover:border-red-500/40 text-[10px] font-mono text-gray-300 transition-colors"
                >
                  [{chip}]
                </button>
              ))}
            </div>

            {/* Input Footer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about workout plans, pricing..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
