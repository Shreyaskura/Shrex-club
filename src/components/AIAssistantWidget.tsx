import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Dumbbell } from 'lucide-react';

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
      text: "Hey! I'm Shreyas. Welcome to SHREX CLUB! 💪\n\nAsk me anything about workouts, diet, membership plans, timings, supplements, or training routines — I'm here to help!",
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
    'Gym Timings & Location',
    'Membership Fees',
    'Diet & Protein Guide',
    'Workout Routine',
    'WhatsApp Shreyas',
  ];

  const getShreyasResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. Identity / Who is Shreyas
    if (q.includes('who are you') || q.includes('your name') || q.includes('who is shreyas') || q.includes('shreyas')) {
      return "I'm Shreyas! I run and manage SHREX CLUB. My mission is to give you an elite, luxury athletic sanctum with calibrated steel, data tracking, and real results. How can I help your training today?";
    }

    // 2. Contact / WhatsApp / Instagram / Phone / Email
    if (
      q.includes('whatsapp') ||
      q.includes('contact') ||
      q.includes('call') ||
      q.includes('phone') ||
      q.includes('number') ||
      q.includes('instagram') ||
      q.includes('insta') ||
      q.includes('email') ||
      q.includes('gmail')
    ) {
      return "You can reach me directly anytime:\n\n• WhatsApp / Call: +91 90144 04462\n• Instagram: @Shreyas__.2008\n• Gmail: Shreyaskura@gmail.com\n\nFeel free to ping me on WhatsApp for quick membership inquiries or gym tours!";
    }

    // 3. Timings / Hours / Opening
    if (q.includes('timing') || q.includes('timings') || q.includes('hour') || q.includes('hours') || q.includes('open') || q.includes('close') || q.includes('sunday')) {
      return "SHREX CLUB is open 24 HOURS • 7 DAYS A WEEK! 🕒\n\nYou have round-the-clock biometric floor access, so you can crush your workouts early morning or late midnight whenever fits your schedule.";
    }

    // 4. Location / Address / Where
    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('place') || q.includes('hyderabad') || q.includes('kukatpally')) {
      return "We are located at:\n📍 Main Boulevard, Pragathi Nagar, Kukatpally, Hyderabad, Telangana 500090.\n\nCheck out the interactive map section on our page for exact 1-tap Google Maps directions!";
    }

    // 5. Pricing / Membership / Fees / Cost / Price
    if (q.includes('membership') || q.includes('price') || q.includes('pricing') || q.includes('fee') || q.includes('fees') || q.includes('cost') || q.includes('join') || q.includes('offer')) {
      return "Here are our membership tiers:\n\n1. ESSENTIAL — ₹1,499/mo\n• Full powerlifting & cardio floor access + locker\n\n2. PERFORMANCE (Most Popular) — ₹2,999/mo\n• Full gym + Finnish sauna, CrossFit suite, recovery amenities & monthly guest pass\n\n3. ELITE VIP — ₹5,999/mo\n• All-access + 1-on-1 personal training, custom nutrition protocol & 3D body scans.\n\nTap 'JOIN NOW' or message me on WhatsApp (+91 90144 04462) to get started!";
    }

    // 6. Free Trial / Pass / Demo
    if (q.includes('trial') || q.includes('free pass') || q.includes('demo') || q.includes('visit') || q.includes('tour')) {
      return "Yes! You can claim a FREE 1-Day VIP Pass! 🎟️\n\nSimply fill out the 'BOOK A FREE VISIT' form below or ping me on WhatsApp at +91 90144 04462 with your name to reserve your workout slot today.";
    }

    // 7. Diet / Nutrition / Protein / Food / Calories / Macros
    if (q.includes('diet') || q.includes('food') || q.includes('eat') || q.includes('protein') || q.includes('calorie') || q.includes('calories') || q.includes('macro') || q.includes('nutrition') || q.includes('meal')) {
      return "Here are the golden nutrition rules:\n\n• Protein: Eat 1.6g to 2.2g of protein per kg of bodyweight (eggs, chicken breast, paneer, tofu, Greek yogurt, whey).\n• Fat Loss: Stay in a 300-500 kcal deficit.\n• Muscle Gain: Eat in a 200-400 kcal surplus.\n• Water: Drink 3-4 liters daily.\n\n👉 Try our interactive Macro Calculator right on this website to calculate your exact personalized daily calories and macros!";
    }

    // 8. Supplements / Creatine / Whey / Pre-workout
    if (q.includes('creatine') || q.includes('supplement') || q.includes('supplements') || q.includes('whey') || q.includes('preworkout') || q.includes('pre-workout')) {
      return "Supplement essentials:\n\n1. Creatine Monohydrate: 3-5g daily with water. It boosts ATP energy, power output, and muscle volume. No loading needed!\n2. Whey Protein: Convenient way to hit daily protein targets, especially post-workout.\n3. Pre-Workout / Caffeine: Take 20-30 mins prior to intense training for extra energy and focus.\n4. Multivitamin + Omega-3: For overall recovery and joint health.";
    }

    // 9. Chest / Bench Press
    if (q.includes('chest') || q.includes('bench press') || q.includes('pecs') || q.includes('push')) {
      return "Elite Chest Protocol:\n\n1. Incline Dumbbell Press: 3 sets x 8-10 reps (Upper chest builder)\n2. Flat Barbell Bench Press: 3 sets x 6-8 reps (Heavy power)\n3. Cable Chest Flyes: 3 sets x 12-15 reps (Peak contraction & stretch)\n4. Weighted Dips: 2-3 sets to near failure.\n\nCheck out our interactive 3D Muscle Map on this page for exercise breakdowns!";
    }

    // 10. Arms / Biceps / Triceps
    if (q.includes('arm') || q.includes('arms') || q.includes('bicep') || q.includes('biceps') || q.includes('tricep') || q.includes('triceps')) {
      return "Big Arms Blueprint (Triceps make up 60% of your arm size!):\n\n• Triceps: Overhead Cable Rope Extensions (3x12), Heavy Barbell Skull Crushers (3x8-10), Cable Pushdowns (3x15).\n• Biceps: Incline Dumbbell Curls (3x10 with deep stretch), EZ-Bar Preacher Curls (3x10-12), Hammer Curls (3x10 for brachialis thickness).\n\nTrain arms 2x a week with strict form!";
    }

    // 11. Back / Lats / Pull
    if (q.includes('back') || q.includes('lat') || q.includes('lats') || q.includes('pull up') || q.includes('pullup') || q.includes('deadlift') || q.includes('row')) {
      return "V-Taper Back Routine:\n\n1. Deadlifts: 3 sets x 5 reps (Posterior chain strength)\n2. Weighted Pull-ups / Lat Pulldown: 3 sets x 8-10 reps (Back width)\n3. Chest-Supported T-Bar Row: 3 sets x 10 reps (Mid-back thickness)\n4. Seated Cable Row: 3 sets x 12 reps\n\nFocus on driving your elbows back, not just pulling with your hands!";
    }

    // 12. Legs / Squats / Quads / Hamstrings / Calves
    if (q.includes('leg') || q.includes('legs') || q.includes('squat') || q.includes('squats') || q.includes('quad') || q.includes('quads') || q.includes('hamstring') || q.includes('calf') || q.includes('calves')) {
      return "Leg Day Routine (Never skip legs!):\n\n1. Barbell Back Squats: 4 sets x 6-8 reps (Heavy king of leg exercises)\n2. Romanian Deadlifts (RDLs): 3 sets x 8-10 reps (Hamstrings & glutes)\n3. Leg Press: 3 sets x 10-12 reps\n4. Bulgarian Split Squats: 3 sets x 8-10 reps per leg\n5. Standing Calf Raises: 4 sets x 15 reps.";
    }

    // 13. Shoulders / Delts
    if (q.includes('shoulder') || q.includes('shoulders') || q.includes('delt') || q.includes('delts') || q.includes('lateral raise')) {
      return "Boulder Shoulders Routine:\n\n• Front Delts: Overhead Barbell / Dumbbell Military Press (3x6-8 reps)\n• Side Delts (Crucial for width!): Dumbbell or Cable Lateral Raises (4x12-15 reps, 2-3x per week)\n• Rear Delts: Face Pulls or Reverse Pec Deck Flyes (3x15 reps for 3D shoulder balance).";
    }

    // 14. Abs / Core / Six Pack / Belly
    if (q.includes('abs') || q.includes('six pack') || q.includes('core') || q.includes('belly') || q.includes('stomach')) {
      return "Six-Pack Truth:\n\n• Abs are revealed through a caloric deficit (getting body fat below 12-14% for men, 20-22% for women).\n• To build deep, thick abs: Hanging Leg Raises (3x12-15), Cable Woodchoppers, and Cable Rope Crunches (3x15).\n• Spot reduction is a myth — train heavy, eat in a deficit, and consistency will reveal your core!";
    }

    // 15. Fat Loss / Weight Loss / Cutting / Slim
    if (q.includes('weight loss') || q.includes('fat loss') || q.includes('lose fat') || q.includes('lose weight') || q.includes('cutting') || q.includes('burn fat')) {
      return "The Proven Fat Loss Strategy:\n\n1. Moderate Calorie Deficit (300-500 kcal under maintenance)\n2. High Protein (1.8-2.0g/kg) to protect your muscles while dropping fat\n3. Heavy Strength Training 4-5x a week (burns more calories at rest)\n4. Daily Steps: Aim for 8,000 - 10,000 steps\n5. Cardio: 20 mins of incline treadmill walk post-workout.";
    }

    // 16. Muscle Gain / Bulk / Hypertrophy / Build
    if (q.includes('muscle') || q.includes('gain') || q.includes('bulk') || q.includes('hypertrophy') || q.includes('size') || q.includes('stronger')) {
      return "Max Hypertrophy Blueprint:\n\n1. Progressive Overload: Add 1 extra rep or 1-2 kg to your lifts each week\n2. Calorie Surplus: Eat 250-400 kcal above maintenance with high carbs & protein\n3. Volume: 10-18 hard sets per muscle group weekly in the 6-12 rep range\n4. Rest: 7-9 hours of deep sleep (muscles grow while you sleep, not in the gym!).";
    }

    // 17. Beginner / New to gym / First week
    if (q.includes('beginner') || q.includes('new') || q.includes('start') || q.includes('first time') || q.includes('first day')) {
      return "Welcome to the iron journey! Here is your beginner checklist:\n\n1. Start with 3 days/week Full-Body routine or 4-day Upper/Lower split.\n2. Master compound movements (Squats, Bench Press, Rows, Lat Pulldowns) with light weights first.\n3. Always warm up with 5 mins of mobility before lifting.\n4. Ask our trainers on the floor anytime — we are here to ensure your form is 100% safe!";
    }

    // 18. Workout Plan / Split
    if (q.includes('workout plan') || q.includes('workout routine') || q.includes('split') || q.includes('plan')) {
      return "Recommended Training Splits:\n\n• 3 Days/Week: Full Body (Mon / Wed / Fri)\n• 4 Days/Week: Upper / Lower Split (Mon, Tue, Thu, Fri)\n• 5-6 Days/Week: Push / Pull / Legs (PPL) — Best for muscle hypertrophy!\n\nCheck out the 'TRAINING PROGRAMS' and 'INTERACTIVE MUSCLE MAP' sections on our homepage to see full breakdowns!";
    }

    // 19. Equipment / Facilities / Machines
    if (q.includes('equipment') || q.includes('machine') || q.includes('facility') || q.includes('facilities') || q.includes('sauna') || q.includes('ice bath')) {
      return "SHREX CLUB features world-class equipment:\n\n• Eleiko competition barbells & calibrated steel plates\n• Curved Woodway treadmills & HIIT assault bikes\n• Dumbbells up to 60 kg\n• Custom power racks with safety straps\n• Recovery Suite: Dry Finnish sauna and ice plunge cryo tubs!";
    }

    // 20. Trainers / Personal Coach
    if (q.includes('trainer') || q.includes('trainers') || q.includes('coach') || q.includes('coaching') || q.includes('personal training') || q.includes('pt')) {
      return "Our coaches are certified master trainers led by Head Coach Arjun Sharma (IFBB Pro Coach & Powerlifting Specialist). They provide custom biomechanics analysis, periodized lifting plans, and 24/7 accountability.\n\nWant to book a 1-on-1 session? WhatsApp me at +91 90144 04462!";
    }

    // Default friendly answer from Shreyas
    return "I'm Shreyas! At SHREX CLUB, we're dedicated to helping you reach your peak athletic potential.\n\nYou can ask me about:\n• Workout plans & exercise form\n• Diet, calories & protein intake\n• Membership fees & free visit pass\n• Gym timings (24/7) & location\n\nOr chat with me directly on WhatsApp at +91 90144 04462!";
  };

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

    // Simulate thoughtful response after brief typing pause
    setTimeout(() => {
      const reply = getShreyasResponse(query);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3">
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0E0E14]/90 backdrop-blur-md border border-red-500/40 text-white shadow-[0_4px_20px_rgba(229,9,20,0.35)] cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-heading font-black text-xs tracking-wider">IM SHREYAS</span>
          </motion.button>
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group p-4 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-red-400 text-white shadow-[0_0_30px_rgba(229,9,20,0.6)] flex items-center justify-center cursor-pointer"
          aria-label="Open Chat with Shreyas"
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
            className="fixed bottom-24 right-4 sm:right-8 z-[999] w-[92vw] sm:w-[390px] h-[540px] rounded-3xl glass-panel border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden bg-[#0A0A0F]/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-red-950/90 via-red-900/40 to-transparent border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 border border-red-400/50 flex items-center justify-center text-white shadow-lg shadow-red-600/30 font-heading font-black text-base">
                  S
                </div>
                <div>
                  <span className="font-heading font-black text-sm text-white flex items-center gap-1.5 tracking-wide">
                    IM SHREYAS
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE • YOUR 24/7 GYM GUIDE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Chat"
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
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-red-600 text-white rounded-br-none border border-red-400/40 shadow-md'
                        : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/10 backdrop-blur-md'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className="text-[9px] font-mono opacity-60 block text-right mt-1.5">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-2xl w-fit border border-white/10">
                  <Dumbbell className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                  <span>Shreyas is typing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Option Prompts Chips */}
            <div className="px-3 py-2 border-t border-white/10 flex gap-1.5 overflow-x-auto scrollbar-none bg-black/40">
              {quickPrompts.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-red-600/30 hover:border-red-500/40 text-[10px] font-mono text-gray-300 hover:text-white transition-colors cursor-pointer"
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
              className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#09090D]"
            >
              <input
                type="text"
                placeholder="Ask Shreyas anything about workouts, diet, fees..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer shadow-md shadow-red-600/30"
                aria-label="Send Message"
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
