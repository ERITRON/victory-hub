/*
 * Victory Hub - AI Assistant Page
 * Chat interface with local response generation, typing animation,
 * quick prompts, and glassmorphism design
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Trash2, Sparkles, BookOpen, Brain, Lightbulb,
  Calculator, Atom, FlaskConical, Globe, PenLine, Monitor,
  GraduationCap, ChevronDown, MessageSquare, Zap, Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const bubbleIn = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

/* ------------------------------------------------------------------
   Typing indicator (3 bouncing dots)
   ------------------------------------------------------------------ */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-end gap-3 px-4 md:px-0"
    >
      {/* Bot avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
        <Bot className="h-4 w-4" />
      </div>

      <div className="rounded-2xl rounded-bl-sm border border-border/50 bg-muted px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-muted-foreground/50"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Local AI response generator (no API calls)
   ------------------------------------------------------------------ */

function generateAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  /* Greetings */
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|yo)\b/.test(msg)) {
    const greetings = [
      "Hello! 👋 Welcome to Victory Hub's AI Assistant! I'm here to help you with your studies. What subject would you like to explore today?",
      "Hey there! 😊 Great to see you! I can help with Mathematics, Physics, Chemistry, Biology, English, ICT, Economics, History, and Geography. What's on your mind?",
      "Hi! 🌟 Ready to learn something new? Ask me about any subject, study tips, or homework help!",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /* Thanks */
  if (/^(thanks?|thank you|thx|ty|appreciate)\b/.test(msg)) {
    const thanks = [
      "You're welcome! 😊 Feel free to ask me anything else. Keep up the great work!",
      "Happy to help! 🌟 Remember, consistent effort beats last-minute cramming. You've got this!",
      "Anytime! 💪 I'm always here when you need help. Keep studying!",
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }

  /* Study tips / strategies */
  if (/study tip|how to study|study better|study hack|memoriz|remember|revision|exam prep/.test(msg)) {
    return "📚 **Top Study Tips:**\n\n1. **Active Recall** — Test yourself instead of re-reading. Use flashcards and quizzes on Victory Hub!\n\n2. **Spaced Repetition** — Review material at increasing intervals (1 day, 3 days, 7 days, 14 days).\n\n3. **Pomodoro Technique** — Study for 25 minutes, take a 5-minute break. After 4 cycles, take a longer break.\n\n4. **Teach Someone Else** — Explaining concepts aloud helps you understand them deeply.\n\n5. **Mind Mapping** — Connect ideas visually to see the big picture.\n\n6. **Sleep Well** — Your brain consolidates memories during sleep. Aim for 7-9 hours!\n\nTry our Quiz and Flashcard features to put these tips into practice!";
  }

  /* Time management */
  if (/time management|schedule|plan|procrastinat|distract|focus/.test(msg)) {
    return "⏰ **Time Management Strategies:**\n\n• **Create a Study Schedule** — Use Victory Hub's Planner to organize your study sessions by subject and priority.\n\n• **The 2-Minute Rule** — If a task takes less than 2 minutes, do it immediately.\n\n• **Block Distractions** — Put your phone in another room. Use website blockers during study time.\n\n• **Prioritize with Eisenhower Matrix** — Sort tasks by Urgent vs. Important.\n\n• **Study in Chunks** — Break large topics into 20-30 minute focused sessions.\n\n• **Set Daily Goals** — Use our Dashboard to track daily study targets.\n\nRemember: Consistency beats intensity. 30 focused minutes daily > 5 hours of cramming!";
  }

  /* Mathematics */
  if (/math|algebra|equation|calculus|geometry|trigonometry|fraction|derivative|integral|quadratic|pythagor/.test(msg)) {
    return "🔢 **Mathematics Help:**\n\nHere's a quick guide based on your question:\n\n• **Algebra** — Remember PEMDAS (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction). When solving equations, always perform the same operation on both sides.\n\n• **Quadratic Formula**: x = (-b ± √(b²-4ac)) / 2a\n\n• **Pythagorean Theorem**: a² + b² = c² (right triangles)\n\n• **Area Formulas**:\n  - Circle: A = πr²\n  - Triangle: A = ½bh\n  - Rectangle: A = lw\n\n• **Trig Basics**: SOH-CAH-TOA\n  - sin = Opposite/Hypotenuse\n  - cos = Adjacent/Hypotenuse\n  - tan = Opposite/Adjacent\n\nHead to the Mathematics subject page for structured lessons and quizzes to practice!";
  }

  /* Physics */
  if (/physics|newton|force|motion|energy|velocity|acceleration|gravity|wave|thermodynamic|electricity|circuit|momentum/.test(msg)) {
    return "⚡ **Physics Concepts:**\n\n• **Newton's Laws**:\n  1. An object at rest stays at rest (inertia)\n  2. F = ma (Force = mass × acceleration)\n  3. Every action has an equal and opposite reaction\n\n• **Key Formulas**:\n  - Speed: v = d/t\n  - Acceleration: a = (v₂ - v₁) / t\n  - Kinetic Energy: KE = ½mv²\n  - Potential Energy: PE = mgh\n  - Momentum: p = mv\n\n• **Wave Properties**: Frequency, Wavelength, Amplitude, Speed (v = fλ)\n\n• **Electricity**: Ohm's Law (V = IR), Power (P = VI)\n\nVisit the Physics section for detailed lessons and practice quizzes!";
  }

  /* Chemistry */
  if (/chemistry|element|atom|molecule|reaction|periodic table|bond|acid|base|ion|oxid|reduc|mole/.test(msg)) {
    return "🧪 **Chemistry Fundamentals:**\n\n• **Atomic Structure**: Protons (+), Neutrons (0), Electrons (-)\n  - Atomic Number = Protons\n  - Mass Number = Protons + Neutrons\n\n• **Bonding Types**:\n  - Ionic: Transfer of electrons (metal + non-metal)\n  - Covalent: Sharing of electrons (non-metal + non-metal)\n\n• **The Mole**: 1 mole = 6.022 × 10²³ particles (Avogadro's number)\n\n• **Acids vs Bases**:\n  - Acids: pH < 7, release H⁺ ions\n  - Bases: pH > 7, release OH⁻ ions\n  - Neutral: pH = 7\n\n• **Balancing Equations**: Same number of each atom on both sides!\n\nCheck out the Chemistry lessons for in-depth coverage!";
  }

  /* Biology */
  if (/biology|cell|dna|genetic|evolution|ecosystem|photosynthesis|mitosis|meiosis|organ|species|protein|enzyme/.test(msg)) {
    return "🧬 **Biology Essentials:**\n\n• **Cell Theory**: All living things are made of cells; cells are the basic unit of life; all cells come from pre-existing cells.\n\n• **Cell Organelles**:\n  - Nucleus: Control center (contains DNA)\n  - Mitochondria: Powerhouse (ATP production)\n  - Ribosomes: Protein synthesis\n  - Cell Membrane: Selective barrier\n\n• **DNA**: Double helix structure made of nucleotides (A-T, G-C base pairs)\n\n• **Photosynthesis**: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (sunlight + chlorophyll)\n\n• **Cell Division**:\n  - Mitosis: 2 identical cells (growth/repair)\n  - Meiosis: 4 unique cells (reproduction)\n\nExplore the Biology section for comprehensive lessons!";
  }

  /* English / Language */
  if (/english|grammar|essay|writing|literature|poem|novel|shakespeare|vocabulary|punctuation|sentence|paragraph/.test(msg)) {
    return "📝 **English & Writing Tips:**\n\n• **Essay Structure**:\n  1. Introduction (hook + thesis statement)\n  2. Body Paragraphs (topic sentence + evidence + analysis)\n  3. Conclusion (restate thesis + final thought)\n\n• **Grammar Essentials**:\n  - Subject-Verb Agreement\n  - Proper use of commas, semicolons, colons\n  - Active vs. Passive voice (prefer active!)\n  - Avoid run-on sentences\n\n• **Vocabulary Building**:\n  - Read widely and note new words\n  - Use flashcards to memorize definitions\n  - Practice using new words in sentences\n\n• **Literary Devices**: Metaphor, Simile, Personification, Alliteration, Irony, Symbolism\n\nCheck the English section for lessons and quizzes!";
  }

  /* ICT / Computer Science */
  if (/ict|computer|programming|coding|algorithm|database|network|software|hardware|binary|html|css|python|internet/.test(msg)) {
    return "💻 **ICT & Computing:**\n\n• **Computer Components**:\n  - CPU: Processes instructions (the \"brain\")\n  - RAM: Temporary memory (volatile)\n  - Storage: Permanent data (HDD/SSD)\n  - Input/Output devices\n\n• **Binary System**: Computers use 0s and 1s\n  - 1 byte = 8 bits\n  - 1 KB = 1,024 bytes\n\n• **Networking**:\n  - LAN (Local Area Network)\n  - WAN (Wide Area Network)\n  - TCP/IP Protocol\n\n• **Programming Basics**:\n  - Variables store data\n  - Loops repeat actions\n  - Conditions make decisions\n  - Functions organize code\n\n• **HTML/CSS**: Structure (HTML) + Style (CSS) = Web pages\n\nVisit the ICT subject for structured lessons!";
  }

  /* Economics */
  if (/economic|supply|demand|market|inflation|gdp|tax|trade|money|price|elasticity|monopoly/.test(msg)) {
    return "📊 **Economics Key Concepts:**\n\n• **Supply & Demand**:\n  - Price ↑ → Quantity Demanded ↓, Quantity Supplied ↑\n  - Equilibrium: Where supply meets demand\n\n• **Market Structures**:\n  - Perfect Competition\n  - Monopoly (single seller)\n  - Oligopoly (few sellers)\n  - Monopolistic Competition\n\n• **Key Indicators**:\n  - GDP: Total value of goods/services produced\n  - Inflation: General rise in price levels\n  - Unemployment Rate: % of workforce without jobs\n\n• **Government Policies**:\n  - Fiscal Policy: Government spending & taxation\n  - Monetary Policy: Interest rates & money supply\n\nStudy the Economics section for detailed lessons!";
  }

  /* History */
  if (/history|war|revolution|civilization|ancient|medieval|colonial|independence|empire|dynasty|treaty/.test(msg)) {
    return "🏛️ **History Study Guide:**\n\nWhen studying history, remember these key approaches:\n\n• **Chronological Thinking** — Place events in proper time order\n\n• **Cause & Effect** — Every historical event has causes and consequences\n\n• **Primary vs. Secondary Sources**:\n  - Primary: Eyewitness accounts, original documents\n  - Secondary: Textbooks, analyses written later\n\n• **Key Themes to Track**:\n  - Political changes (revolutions, treaties)\n  - Economic developments (trade, industrialization)\n  - Social movements (rights, reforms)\n  - Cultural shifts (art, religion, philosophy)\n\n• **Essay Tips for History**:\n  - Always include specific dates and names\n  - Use multiple perspectives\n  - Connect events to broader themes\n\nExplore the History section for structured timelines and lessons!";
  }

  /* Geography */
  if (/geography|climate|weather|mountain|river|ocean|continent|map|population|urban|migration|volcano|erosion/.test(msg)) {
    return "🌍 **Geography Concepts:**\n\n• **Climate vs. Weather**:\n  - Weather: Short-term atmospheric conditions\n  - Climate: Long-term average weather patterns\n\n• **Landforms**:\n  - Mountains (tectonic plates collision)\n  - Rivers (erosion & deposition)\n  - Volcanoes (magma eruption)\n  - Glaciers (slow-moving ice)\n\n• **Population Geography**:\n  - Birth rate, death rate, migration\n  - Population density = people / area\n  - Demographic transition model\n\n• **Map Skills**:\n  - Latitude (N/S) and Longitude (E/W)\n  - Contour lines show elevation\n  - Scale = map distance / real distance\n\nCheck the Geography section for detailed lessons and quizzes!";
  }

  /* Motivation / encouragement */
  if (/motivat|tired|give up|stressed|anxious|worried|scared|overwhelm|can't do|impossible|hard|difficult|struggle/.test(msg)) {
    return "💪 **You've Got This!**\n\nHere's some encouragement:\n\n\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" — Winston Churchill\n\n🌟 **Remember**:\n\n• Every expert was once a beginner\n• Small progress is still progress\n• It's okay to take breaks — rest is productive\n• Focus on understanding, not perfection\n• Your effort today builds your future self\n\n**Quick Reset Tips**:\n1. Take a 10-minute walk\n2. Drink water and stretch\n3. Break your task into smaller pieces\n4. Celebrate what you've already accomplished\n5. Check your achievements on Victory Hub — see how far you've come!\n\nYou're doing amazing. Keep going! 🎉";
  }

  /* What can you do */
  if (/what can you|what do you|help me with|capable|features|abilities/.test(msg)) {
    return "🎯 **I can help you with many things!**\n\n📚 **Subject Help:**\n• Mathematics — Equations, formulas, problem-solving\n• Physics — Forces, energy, waves, electricity\n• Chemistry — Elements, reactions, bonding\n• Biology — Cells, genetics, ecosystems\n• English — Grammar, essay writing, literature\n• ICT — Programming, networking, hardware\n• Economics — Supply & demand, markets\n• History — Events, timelines, analysis\n• Geography — Climate, landforms, population\n\n🧠 **Study Support:**\n• Study tips and strategies\n• Time management advice\n• Exam preparation techniques\n• Motivation and encouragement\n\n💡 Just type your question and I'll do my best to help!";
  }

  /* Calculator / math computation hints */
  if (/calculate|what is \d|what's \d|\d \+|\d -|\d \*|convert/.test(msg)) {
    return "🔢 **Mathematical Calculations:**\n\nI can guide you through calculations! Here are some common operations:\n\n• **Order of Operations (PEMDAS)**:\n  1. Parentheses first\n  2. Exponents\n  3. Multiplication & Division (left to right)\n  4. Addition & Subtraction (left to right)\n\n• **Percentages**: To find X% of Y → (X/100) × Y\n• **Averages**: Sum all values ÷ number of values\n\nTry using our Quiz feature for practice math problems! I'll walk you through the steps.";
  }

  /* Default / fallback responses */
  const defaults = [
    `That's an interesting question about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}"! 🤔\n\nHere's what I'd suggest:\n\n1. **Break it down** — Identify the key concepts in your question\n2. **Check our lessons** — Browse the Subjects page for related material\n3. **Practice with quizzes** — Test your understanding with topic-specific quizzes\n4. **Make flashcards** — Create cards for important terms and definitions\n\nWould you like to try asking about a specific subject? I can help with Math, Physics, Chemistry, Biology, English, ICT, Economics, History, and Geography!`,
    `Great question! 💡\n\nWhile I might not have a specific answer for that exact topic, here are some study strategies:\n\n• **Use the SQ3R Method**: Survey, Question, Read, Recite, Review\n• **Create Mind Maps** to connect related ideas\n• **Practice Active Recall** by closing your notes and trying to remember key points\n• **Teach the concept** to someone else (or even to yourself out loud)\n\nTry exploring our Subjects section for structured lessons on 9 different subjects!`,
    `I appreciate you asking! 🌟 Let me help guide you:\n\n**For academic questions**, I'm best at:\n- Mathematics, Physics, Chemistry, Biology\n- English, ICT, Economics\n- History, Geography\n- Study tips and exam strategies\n\n**Try rephrasing** your question with subject-specific keywords, or explore our lesson library in the Subjects tab!`,
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}

/* ------------------------------------------------------------------
   Quick prompt suggestions
   ------------------------------------------------------------------ */

const QUICK_PROMPTS = [
  { icon: Lightbulb, label: 'Study Tips', prompt: 'Give me some effective study tips' },
  { icon: Calculator, label: 'Math Help', prompt: 'Help me with algebra and equations' },
  { icon: Atom, label: 'Physics', prompt: 'Explain Newton\'s laws of motion' },
  { icon: FlaskConical, label: 'Chemistry', prompt: 'Help me understand chemical bonding' },
  { icon: Brain, label: 'Biology', prompt: 'Explain how cells work' },
  { icon: PenLine, label: 'English', prompt: 'How do I write a great essay?' },
  { icon: Monitor, label: 'ICT', prompt: 'Explain how computer networks work' },
  { icon: Globe, label: 'Geography', prompt: 'What causes climate change?' },
  { icon: Clock, label: 'Time Mgmt', prompt: 'How can I manage my study time better?' },
  { icon: Zap, label: 'Motivation', prompt: 'I need motivation to keep studying' },
];

/* ------------------------------------------------------------------
   Feature cards data
   ------------------------------------------------------------------ */

const AI_FEATURES = [
  { icon: BookOpen, title: 'Subject Expert', desc: 'Get help across 9 subjects — Math, Physics, Chemistry, Biology, English, ICT, Economics, History, Geography.', color: 'from-amber-500 to-orange-500' },
  { icon: Lightbulb, title: 'Study Strategies', desc: 'Learn proven techniques like active recall, spaced repetition, and the Pomodoro method.', color: 'from-emerald-500 to-teal-500' },
  { icon: Brain, title: 'Concept Explanations', desc: 'Break down complex topics into simple, easy-to-understand explanations.', color: 'from-violet-500 to-purple-500' },
  { icon: Sparkles, title: 'Offline & Private', desc: 'All responses generated locally. No data sent to any server — your conversations stay private.', color: 'from-rose-500 to-pink-500' },
];

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export function AIAssistantPage() {
  const chatMessages = useAppStore((s) => s.chatMessages);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const clearChat = useAppStore((s) => s.clearChat);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom when new messages arrive */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping, scrollToBottom]);

  /* Send message handler */
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    addChatMessage('user', trimmed);
    setInput('');
    setIsTyping(true);

    /* Simulate AI thinking delay (800ms–2000ms) */
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = generateAIResponse(trimmed);
      addChatMessage('assistant', response);
      setIsTyping(false);
    }, delay);

    /* Reset textarea height */
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  }, [input, isTyping, addChatMessage]);

  /* Handle keyboard shortcut: Enter to send, Shift+Enter for newline */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  /* Auto-resize textarea */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  }, []);

  /* Format timestamp */
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /* Simple markdown-like formatting for bold */
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      /* Bold: **text** */
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '⟨$1⟩');

      /* Headings: ## text */
      if (formatted.startsWith('## ')) {
        formatted = formatted.replace('## ', '');
        return (
          <span key={i} className="block mt-2 mb-1 font-bold text-sm">
            {formatted}
          </span>
        );
      }

      /* Bullet points */
      if (formatted.trimStart().startsWith('•') || formatted.trimStart().startsWith('- ')) {
        return (
          <span key={i} className="block ml-2">
            <span className="mr-1.5 text-muted-foreground">•</span>
            {formatted.trimStart().replace(/^[•-]\s*/, '')}
          </span>
        );
      }

      /* Numbered lists: 1. text */
      const numMatch = formatted.trimStart().match(/^(\d+)\.\s/);
      if (numMatch) {
        return (
          <span key={i} className="block ml-2">
            <span className="mr-1 text-muted-foreground">{numMatch[1]}.</span>
            {formatted.trimStart().replace(/^\d+\.\s/, '')}
          </span>
        );
      }

      /* Empty line = paragraph break */
      if (line.trim() === '') {
        return <span key={i} className="block h-2" />;
      }

      return (
        <span key={i} className="block">
          {formatted}
        </span>
      );
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ===== Hero Section ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 md:p-14 text-white"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20"
          >
            <Bot className="h-9 w-9" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            AI{' '}
            <span className="underline decoration-4 decoration-white/40 underline-offset-4">
              Assistant
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-white/90">
            Your personal study companion — ask questions, get explanations, and
            master any subject. All responses are generated locally.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Badge variant="secondary" className="border-0 bg-white/20 text-white hover:bg-white/30">
              <Sparkles className="mr-1 h-3 w-3" /> Offline Ready
            </Badge>
            <Badge variant="secondary" className="border-0 bg-white/20 text-white hover:bg-white/30">
              <GraduationCap className="mr-1 h-3 w-3" /> 9 Subjects
            </Badge>
          </div>
        </div>
      </motion.section>

      {/* ===== Feature Cards ===== */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AI_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border-0 bg-card/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-5">
                    <div
                      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== Chat Interface ===== */}
      <section className="space-y-4">
        {/* Chat Header */}
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Study Chat</h2>
                <p className="text-xs text-muted-foreground">
                  {isTyping ? (
                    <span className="text-violet-500 font-medium">Typing a response...</span>
                  ) : (
                    `${chatMessages.length} message${chatMessages.length !== 1 ? 's' : ''} in conversation`
                  )}
                </p>
              </div>
            </div>
            {chatMessages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={clearChat}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Clear Chat
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Chat Messages Container */}
        <Card className="border-0 bg-card/60 backdrop-blur-xl overflow-hidden">
          <div
            ref={chatContainerRef}
            className="flex flex-col gap-4 p-4 md:p-6 overflow-y-auto"
            style={{ maxHeight: '28rem', minHeight: '16rem' }}
          >
            {chatMessages.length === 0 && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <Bot className="h-8 w-8 text-violet-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Ask me about any subject, study strategies, or homework help.
                  I&apos;m here to assist you!
                </p>

                {/* Quick Prompts */}
                <div className="mt-6 grid grid-cols-2 gap-2 max-w-md w-full">
                  {QUICK_PROMPTS.slice(0, 6).map((qp) => {
                    const Icon = qp.icon;
                    return (
                      <button
                        key={qp.label}
                        onClick={() => {
                          setInput(qp.prompt);
                          inputRef.current?.focus();
                        }}
                        className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5 text-xs text-left hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200"
                      >
                        <Icon className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                        <span className="truncate">{qp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence mode="popLayout">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={bubbleIn}
                  initial="hidden"
                  animate="visible"
                  layout
                  className={`flex items-end gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Assistant avatar */}
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-sm'
                        : 'border border-border/50 bg-muted rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                    </div>
                    <p
                      className={`mt-1.5 text-[10px] ${
                        msg.role === 'user'
                          ? 'text-white/60'
                          : 'text-muted-foreground/60'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                      <span className="text-xs font-bold">You</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* ===== Input Area ===== */}
        <Card className="border-0 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-end gap-3">
              {/* Textarea */}
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your studies..."
                  rows={1}
                  className="w-full resize-none rounded-xl border border-border/50 bg-background px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-muted-foreground/60"
                  style={{ maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-2.5">
                  <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
                </div>
              </div>

              {/* Send button */}
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-40 shadow-lg transition-all"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>

            {/* Keyboard hint */}
            <div className="mt-2 flex items-center gap-4 px-1">
              <p className="text-[10px] text-muted-foreground/50">
                Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Enter</kbd> to send,{' '}
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Shift+Enter</kbd> for new line
              </p>
              <div className="ml-auto">
                <p className="text-[10px] text-muted-foreground/50">
                  ✨ Generated locally — no data leaves your device
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ===== Quick Prompts Strip (visible when chat has messages) ===== */}
      {chatMessages.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-0 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <p className="text-xs font-medium text-muted-foreground">Try asking about:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((qp) => {
                  const Icon = qp.icon;
                  return (
                    <button
                      key={qp.label}
                      onClick={() => {
                        setInput(qp.prompt);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 text-xs hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200"
                    >
                      <Icon className="h-3 w-3 text-violet-500 shrink-0" />
                      <span>{qp.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </div>
  );
}
