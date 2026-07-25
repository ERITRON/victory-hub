/**
 * Victory Hub - Subjects Data
 * Complete subject definitions with units, lessons, and resources
 */

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  units: Unit[];
  progress: number;
  bookmarks: string[];
}

export interface Unit {
  id: string;
  name: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
}

export const SUBJECTS: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Algebra, Calculus, Geometry, Trigonometry & Statistics',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'math-u1',
        name: 'Algebra & Functions',
        lessons: [
          { id: 'math-u1-l1', title: 'Linear Equations', duration: '45 min', completed: false, type: 'video' },
          { id: 'math-u1-l2', title: 'Quadratic Functions', duration: '50 min', completed: false, type: 'video' },
          { id: 'math-u1-l3', title: 'Polynomial Operations', duration: '40 min', completed: false, type: 'reading' },
          { id: 'math-u1-l4', title: 'Rational Expressions', duration: '55 min', completed: false, type: 'exercise' },
          { id: 'math-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'math-u2',
        name: 'Calculus',
        lessons: [
          { id: 'math-u2-l1', title: 'Limits & Continuity', duration: '60 min', completed: false, type: 'video' },
          { id: 'math-u2-l2', title: 'Derivatives', duration: '55 min', completed: false, type: 'video' },
          { id: 'math-u2-l3', title: 'Integration', duration: '65 min', completed: false, type: 'reading' },
          { id: 'math-u2-l4', title: 'Applications of Calculus', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'math-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'math-u3',
        name: 'Geometry & Trigonometry',
        lessons: [
          { id: 'math-u3-l1', title: 'Triangles & Circles', duration: '45 min', completed: false, type: 'video' },
          { id: 'math-u3-l2', title: 'Trigonometric Ratios', duration: '50 min', completed: false, type: 'video' },
          { id: 'math-u3-l3', title: 'Trigonometric Identities', duration: '55 min', completed: false, type: 'exercise' },
          { id: 'math-u3-l4', title: 'Coordinate Geometry', duration: '40 min', completed: false, type: 'reading' },
          { id: 'math-u3-l5', title: 'Unit 3 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'math-u4',
        name: 'Statistics & Probability',
        lessons: [
          { id: 'math-u4-l1', title: 'Data Collection', duration: '35 min', completed: false, type: 'reading' },
          { id: 'math-u4-l2', title: 'Measures of Central Tendency', duration: '40 min', completed: false, type: 'video' },
          { id: 'math-u4-l3', title: 'Probability Theory', duration: '55 min', completed: false, type: 'video' },
          { id: 'math-u4-l4', title: 'Statistical Distributions', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'math-u4-l5', title: 'Unit 4 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-600',
    description: 'Mechanics, Thermodynamics, Waves, Electricity & Modern Physics',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'phy-u1',
        name: 'Mechanics',
        lessons: [
          { id: 'phy-u1-l1', title: 'Motion in One Dimension', duration: '50 min', completed: false, type: 'video' },
          { id: 'phy-u1-l2', title: 'Newton\'s Laws', duration: '55 min', completed: false, type: 'video' },
          { id: 'phy-u1-l3', title: 'Work, Energy & Power', duration: '45 min', completed: false, type: 'reading' },
          { id: 'phy-u1-l4', title: 'Momentum & Collisions', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'phy-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'phy-u2',
        name: 'Thermodynamics',
        lessons: [
          { id: 'phy-u2-l1', title: 'Heat & Temperature', duration: '40 min', completed: false, type: 'video' },
          { id: 'phy-u2-l2', title: 'Gas Laws', duration: '45 min', completed: false, type: 'reading' },
          { id: 'phy-u2-l3', title: 'Thermodynamic Processes', duration: '50 min', completed: false, type: 'video' },
          { id: 'phy-u2-l4', title: 'Entropy & Efficiency', duration: '55 min', completed: false, type: 'exercise' },
          { id: 'phy-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'phy-u3',
        name: 'Waves & Optics',
        lessons: [
          { id: 'phy-u3-l1', title: 'Wave Properties', duration: '45 min', completed: false, type: 'video' },
          { id: 'phy-u3-l2', title: 'Sound Waves', duration: '40 min', completed: false, type: 'reading' },
          { id: 'phy-u3-l3', title: 'Light & Reflection', duration: '50 min', completed: false, type: 'video' },
          { id: 'phy-u3-l4', title: 'Refraction & Lenses', duration: '45 min', completed: false, type: 'exercise' },
          { id: 'phy-u3-l5', title: 'Unit 3 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'phy-u4',
        name: 'Electricity & Magnetism',
        lessons: [
          { id: 'phy-u4-l1', title: 'Electric Fields', duration: '50 min', completed: false, type: 'video' },
          { id: 'phy-u4-l2', title: 'Electric Circuits', duration: '55 min', completed: false, type: 'exercise' },
          { id: 'phy-u4-l3', title: 'Magnetism', duration: '45 min', completed: false, type: 'video' },
          { id: 'phy-u4-l4', title: 'Electromagnetic Induction', duration: '50 min', completed: false, type: 'reading' },
          { id: 'phy-u4-l5', title: 'Unit 4 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Organic, Inorganic, Physical Chemistry & Laboratory Skills',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'chem-u1',
        name: 'Atomic Structure',
        lessons: [
          { id: 'chem-u1-l1', title: 'Atomic Models', duration: '40 min', completed: false, type: 'video' },
          { id: 'chem-u1-l2', title: 'Electron Configuration', duration: '45 min', completed: false, type: 'video' },
          { id: 'chem-u1-l3', title: 'Periodic Table', duration: '50 min', completed: false, type: 'reading' },
          { id: 'chem-u1-l4', title: 'Chemical Bonding', duration: '55 min', completed: false, type: 'exercise' },
          { id: 'chem-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'chem-u2',
        name: 'Chemical Reactions',
        lessons: [
          { id: 'chem-u2-l1', title: 'Types of Reactions', duration: '45 min', completed: false, type: 'video' },
          { id: 'chem-u2-l2', title: 'Stoichiometry', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'chem-u2-l3', title: 'Redox Reactions', duration: '40 min', completed: false, type: 'video' },
          { id: 'chem-u2-l4', title: 'Reaction Rates', duration: '45 min', completed: false, type: 'reading' },
          { id: 'chem-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'chem-u3',
        name: 'Organic Chemistry',
        lessons: [
          { id: 'chem-u3-l1', title: 'Hydrocarbons', duration: '50 min', completed: false, type: 'video' },
          { id: 'chem-u3-l2', title: 'Functional Groups', duration: '55 min', completed: false, type: 'reading' },
          { id: 'chem-u3-l3', title: 'Organic Reactions', duration: '60 min', completed: false, type: 'video' },
          { id: 'chem-u3-l4', title: 'Polymers', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'chem-u3-l5', title: 'Unit 3 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'Leaf',
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-600',
    description: 'Cell Biology, Genetics, Ecology, Human Physiology & Evolution',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'bio-u1',
        name: 'Cell Biology',
        lessons: [
          { id: 'bio-u1-l1', title: 'Cell Structure', duration: '45 min', completed: false, type: 'video' },
          { id: 'bio-u1-l2', title: 'Cell Organelles', duration: '50 min', completed: false, type: 'video' },
          { id: 'bio-u1-l3', title: 'Cell Division', duration: '55 min', completed: false, type: 'reading' },
          { id: 'bio-u1-l4', title: 'Cell Transport', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'bio-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'bio-u2',
        name: 'Genetics',
        lessons: [
          { id: 'bio-u2-l1', title: 'DNA & RNA', duration: '50 min', completed: false, type: 'video' },
          { id: 'bio-u2-l2', title: 'Mendelian Genetics', duration: '45 min', completed: false, type: 'reading' },
          { id: 'bio-u2-l3', title: 'Genetic Mutations', duration: '40 min', completed: false, type: 'video' },
          { id: 'bio-u2-l4', title: 'Biotechnology', duration: '55 min', completed: false, type: 'exercise' },
          { id: 'bio-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'bio-u3',
        name: 'Human Physiology',
        lessons: [
          { id: 'bio-u3-l1', title: 'Digestive System', duration: '40 min', completed: false, type: 'video' },
          { id: 'bio-u3-l2', title: 'Circulatory System', duration: '45 min', completed: false, type: 'video' },
          { id: 'bio-u3-l3', title: 'Nervous System', duration: '50 min', completed: false, type: 'reading' },
          { id: 'bio-u3-l4', title: 'Reproductive System', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'bio-u3-l5', title: 'Unit 3 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    icon: 'BookOpen',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    description: 'Grammar, Literature, Writing, Comprehension & Vocabulary',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'eng-u1',
        name: 'Grammar & Usage',
        lessons: [
          { id: 'eng-u1-l1', title: 'Parts of Speech', duration: '35 min', completed: false, type: 'reading' },
          { id: 'eng-u1-l2', title: 'Tenses & Aspect', duration: '45 min', completed: false, type: 'video' },
          { id: 'eng-u1-l3', title: 'Sentence Structure', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'eng-u1-l4', title: 'Punctuation', duration: '30 min', completed: false, type: 'reading' },
          { id: 'eng-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'eng-u2',
        name: 'Literature',
        lessons: [
          { id: 'eng-u2-l1', title: 'Poetry Analysis', duration: '50 min', completed: false, type: 'video' },
          { id: 'eng-u2-l2', title: 'Novel Study', duration: '60 min', completed: false, type: 'reading' },
          { id: 'eng-u2-l3', title: 'Drama & Theatre', duration: '45 min', completed: false, type: 'video' },
          { id: 'eng-u2-l4', title: 'Literary Devices', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'eng-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'eng-u3',
        name: 'Writing Skills',
        lessons: [
          { id: 'eng-u3-l1', title: 'Essay Writing', duration: '55 min', completed: false, type: 'video' },
          { id: 'eng-u3-l2', title: 'Creative Writing', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'eng-u3-l3', title: 'Letter Writing', duration: '35 min', completed: false, type: 'reading' },
          { id: 'eng-u3-l4', title: 'Report Writing', duration: '45 min', completed: false, type: 'exercise' },
          { id: 'eng-u3-l5', title: 'Unit 3 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'ict',
    name: 'ICT',
    icon: 'Monitor',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Programming, Databases, Networking, Web Dev & Digital Literacy',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'ict-u1',
        name: 'Programming Fundamentals',
        lessons: [
          { id: 'ict-u1-l1', title: 'Variables & Data Types', duration: '40 min', completed: false, type: 'video' },
          { id: 'ict-u1-l2', title: 'Control Structures', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'ict-u1-l3', title: 'Functions & Modules', duration: '45 min', completed: false, type: 'video' },
          { id: 'ict-u1-l4', title: 'Arrays & Loops', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'ict-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'ict-u2',
        name: 'Database Management',
        lessons: [
          { id: 'ict-u2-l1', title: 'Introduction to Databases', duration: '35 min', completed: false, type: 'video' },
          { id: 'ict-u2-l2', title: 'SQL Basics', duration: '50 min', completed: false, type: 'exercise' },
          { id: 'ict-u2-l3', title: 'Data Modeling', duration: '45 min', completed: false, type: 'reading' },
          { id: 'ict-u2-l4', title: 'Normalization', duration: '40 min', completed: false, type: 'video' },
          { id: 'ict-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'ict-u3',
        name: 'Web Development',
        lessons: [
          { id: 'ict-u3-l1', title: 'HTML & CSS', duration: '45 min', completed: false, type: 'exercise' },
          { id: 'ict-u3-l2', title: 'JavaScript Basics', duration: '55 min', completed: false, type: 'video' },
          { id: 'ict-u3-l3', title: 'Responsive Design', duration: '40 min', completed: false, type: 'reading' },
          { id: 'ict-u3-l4', title: 'Web Frameworks', duration: '50 min', completed: false, type: 'video' },
          { id: 'ict-u3-l5', title: 'Unit 3 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: 'TrendingUp',
    color: '#f97316',
    gradient: 'from-orange-500 to-red-500',
    description: 'Microeconomics, Macroeconomics, Trade & Development',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'eco-u1',
        name: 'Microeconomics',
        lessons: [
          { id: 'eco-u1-l1', title: 'Supply & Demand', duration: '45 min', completed: false, type: 'video' },
          { id: 'eco-u1-l2', title: 'Market Structures', duration: '50 min', completed: false, type: 'reading' },
          { id: 'eco-u1-l3', title: 'Elasticity', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'eco-u1-l4', title: 'Consumer Behavior', duration: '45 min', completed: false, type: 'video' },
          { id: 'eco-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'eco-u2',
        name: 'Macroeconomics',
        lessons: [
          { id: 'eco-u2-l1', title: 'GDP & Growth', duration: '45 min', completed: false, type: 'video' },
          { id: 'eco-u2-l2', title: 'Inflation & Unemployment', duration: '50 min', completed: false, type: 'reading' },
          { id: 'eco-u2-l3', title: 'Fiscal Policy', duration: '40 min', completed: false, type: 'video' },
          { id: 'eco-u2-l4', title: 'Monetary Policy', duration: '45 min', completed: false, type: 'exercise' },
          { id: 'eco-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Landmark',
    color: '#a855f7',
    gradient: 'from-purple-500 to-pink-500',
    description: 'World History, African History, Government & Political Systems',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'hist-u1',
        name: 'World History',
        lessons: [
          { id: 'hist-u1-l1', title: 'Ancient Civilizations', duration: '50 min', completed: false, type: 'video' },
          { id: 'hist-u1-l2', title: 'Medieval Period', duration: '45 min', completed: false, type: 'reading' },
          { id: 'hist-u1-l3', title: 'Renaissance & Reformation', duration: '50 min', completed: false, type: 'video' },
          { id: 'hist-u1-l4', title: 'World Wars', duration: '55 min', completed: false, type: 'reading' },
          { id: 'hist-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'hist-u2',
        name: 'African History',
        lessons: [
          { id: 'hist-u2-l1', title: 'Pre-Colonial Africa', duration: '50 min', completed: false, type: 'video' },
          { id: 'hist-u2-l2', title: 'Colonial Era', duration: '45 min', completed: false, type: 'reading' },
          { id: 'hist-u2-l3', title: 'Independence Movements', duration: '55 min', completed: false, type: 'video' },
          { id: 'hist-u2-l4', title: 'Modern Africa', duration: '40 min', completed: false, type: 'exercise' },
          { id: 'hist-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-green-500',
    description: 'Physical Geography, Human Geography, Map Skills & Environment',
    progress: 0,
    bookmarks: [],
    units: [
      {
        id: 'geo-u1',
        name: 'Physical Geography',
        lessons: [
          { id: 'geo-u1-l1', title: 'Earth Structure', duration: '40 min', completed: false, type: 'video' },
          { id: 'geo-u1-l2', title: 'Rocks & Minerals', duration: '45 min', completed: false, type: 'reading' },
          { id: 'geo-u1-l3', title: 'Weather & Climate', duration: '50 min', completed: false, type: 'video' },
          { id: 'geo-u1-l4', title: 'Rivers & Oceans', duration: '45 min', completed: false, type: 'exercise' },
          { id: 'geo-u1-l5', title: 'Unit 1 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
      {
        id: 'geo-u2',
        name: 'Human Geography',
        lessons: [
          { id: 'geo-u2-l1', title: 'Population Studies', duration: '45 min', completed: false, type: 'video' },
          { id: 'geo-u2-l2', title: 'Urbanization', duration: '40 min', completed: false, type: 'reading' },
          { id: 'geo-u2-l3', title: 'Agriculture', duration: '45 min', completed: false, type: 'exercise' },
          { id: 'geo-u2-l4', title: 'Environmental Issues', duration: '50 min', completed: false, type: 'video' },
          { id: 'geo-u2-l5', title: 'Unit 2 Quiz', duration: '20 min', completed: false, type: 'quiz' },
        ],
      },
    ],
  },
];