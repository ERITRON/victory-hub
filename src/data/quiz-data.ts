/**
 * Victory Hub - Quiz Question Bank
 * Comprehensive quiz questions for all subjects
 */

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  /* ===== Mathematics ===== */
  { id: 'mq1', subject: 'mathematics', question: 'What is the derivative of x²?', options: ['x', '2x', '2x²', 'x²'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'mq2', subject: 'mathematics', question: 'Solve: 3x + 7 = 22', options: ['3', '5', '7', '15'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'mq3', subject: 'mathematics', question: 'What is the integral of 1/x?', options: ['x²', 'ln|x| + C', '1/x² + C', 'e^x + C'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'mq4', subject: 'mathematics', question: 'What is sin(90°)?', options: ['0', '0.5', '1', '-1'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'mq5', subject: 'mathematics', question: 'The quadratic formula solves equations of the form:', options: ['ax + b = 0', 'ax² + bx + c = 0', 'ax³ + bx² + c = 0', 'a/x + b = 0'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'mq6', subject: 'mathematics', question: 'Sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'mq7', subject: 'mathematics', question: 'What is log₁₀(1000)?', options: ['2', '3', '4', '10'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'mq8', subject: 'mathematics', question: 'Mean of 4, 8, 12, 16?', options: ['8', '10', '12', '14'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'mq9', subject: 'mathematics', question: 'Area of a circle with radius 7? (π≈22/7)', options: ['44', '154', '308', '22'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'mq10', subject: 'mathematics', question: 'If f(x) = 2x³ - 3x + 1, what is f(2)?', options: ['11', '13', '15', '9'], correctAnswer: 0, difficulty: 'medium' },

  /* ===== Physics ===== */
  { id: 'pq1', subject: 'physics', question: 'SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'pq2', subject: 'physics', question: 'Acceleration due to gravity?', options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '11.2 m/s²'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'pq3', subject: 'physics', question: 'Speed of light in vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'pq4', subject: 'physics', question: 'Which law states F = ma?', options: ['First', 'Second', 'Third', 'Universal Gravitation'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'pq5', subject: 'physics', question: 'Unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'pq6', subject: 'physics', question: 'What is kinetic energy formula?', options: ['mgh', '½mv²', 'Fd', 'mv'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'pq7', subject: 'physics', question: 'Which wave is transverse?', options: ['Sound', 'Light', 'Seismic P', 'All'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'pq8', subject: 'physics', question: 'Ohm\'s law states:', options: ['V = IR', 'V = I/R', 'V = I²R', 'V = R/I'], correctAnswer: 0, difficulty: 'easy' },

  /* ===== Chemistry ===== */
  { id: 'cq1', subject: 'chemistry', question: 'Atomic number of Carbon?', options: ['4', '6', '8', '12'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'cq2', subject: 'chemistry', question: 'Chemical formula of water?', options: ['HO', 'H₂O', 'H₂O₂', 'OH₂'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'cq3', subject: 'chemistry', question: 'pH of a neutral solution?', options: ['0', '5', '7', '14'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'cq4', subject: 'chemistry', question: 'Number of bonds in a carbon atom?', options: ['2', '3', '4', '6'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'cq5', subject: 'chemistry', question: 'Avogadro\'s number is:', options: ['6.02×10²²', '6.02×10²³', '6.02×10²⁴', '3.14×10²³'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'cq6', subject: 'chemistry', question: 'Which is a noble gas?', options: ['Oxygen', 'Nitrogen', 'Neon', 'Hydrogen'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'cq7', subject: 'chemistry', question: 'Covalent bond involves:', options: ['Transfer of electrons', 'Sharing of electrons', 'Ionic transfer', 'Metallic bonding'], correctAnswer: 1, difficulty: 'medium' },

  /* ===== Biology ===== */
  { id: 'bq1', subject: 'biology', question: 'Powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'bq2', subject: 'biology', question: 'DNA stands for:', options: ['Deoxyribonucleic Acid', 'Dinitrogen Acid', 'Deoxyribose Nucleic Atom', 'Dynamic Nuclear Acid'], correctAnswer: 0, difficulty: 'easy' },
  { id: 'bq3', subject: 'biology', question: 'Process of cell division is called:', options: ['Osmosis', 'Mitosis', 'Photosynthesis', 'Respiration'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'bq4', subject: 'biology', question: 'Which organelle does photosynthesis?', options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Vacuole'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'bq5', subject: 'biology', question: 'Number of chromosomes in human cell?', options: ['23', '44', '46', '48'], correctAnswer: 2, difficulty: 'medium' },
  { id: 'bq6', subject: 'biology', question: 'Darwin\'s theory is called:', options: ['Big Bang', 'Natural Selection', 'Relativity', 'Quantum Theory'], correctAnswer: 1, difficulty: 'easy' },

  /* ===== English ===== */
  { id: 'eq1', subject: 'english', question: 'Which is a pronoun?', options: ['Run', 'Beautiful', 'She', 'Quickly'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'eq2', subject: 'english', question: '"Metaphor" is a type of:', options: ['Grammar rule', 'Figure of speech', 'Punctuation', 'Sentence type'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'eq3', subject: 'english', question: 'Past tense of "go"?', options: ['Goed', 'Gone', 'Went', 'Going'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'eq4', subject: 'english', question: 'A group of lions is called:', options: ['Herd', 'Pride', 'Flock', 'Pack'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'eq5', subject: 'english', question: 'Which sentence is passive voice?', options: ['She wrote the letter.', 'The letter was written by her.', 'She is writing.', 'She will write.'], correctAnswer: 1, difficulty: 'medium' },

  /* ===== ICT ===== */
  { id: 'iq1', subject: 'ict', question: 'HTML stands for:', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 0, difficulty: 'easy' },
  { id: 'iq2', subject: 'ict', question: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'iq3', subject: 'ict', question: 'Which is NOT a programming language?', options: ['Python', 'HTML', 'Java', 'C++'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'iq4', subject: 'ict', question: 'RAM is:', options: ['Permanent storage', 'Volatile memory', 'Secondary storage', 'Read-only memory'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'iq5', subject: 'ict', question: 'SQL is used for:', options: ['Graphics', 'Database queries', 'Networking', 'Audio processing'], correctAnswer: 1, difficulty: 'easy' },

  /* ===== Economics ===== */
  { id: 'ecq1', subject: 'economics', question: 'Law of demand states that:', options: ['Price up, demand up', 'Price up, demand down', 'Price and demand unrelated', 'Demand creates price'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'ecq2', subject: 'economics', question: 'GDP stands for:', options: ['Gross Domestic Product', 'General Domestic Price', 'Gross Development Plan', 'General Demand Product'], correctAnswer: 0, difficulty: 'easy' },
  { id: 'ecq3', subject: 'economics', question: 'Inflation means:', options: ['Prices falling', 'Prices rising', 'Economy growing', 'Unemployment rising'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'ecq4', subject: 'economics', question: 'Monopoly means:', options: ['Many sellers', 'One seller', 'No sellers', 'Two sellers'], correctAnswer: 1, difficulty: 'easy' },

  /* ===== History ===== */
  { id: 'hq1', subject: 'history', question: 'World War II ended in:', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'hq2', subject: 'history', question: 'The Renaissance began in:', options: ['France', 'England', 'Italy', 'Germany'], correctAnswer: 2, difficulty: 'medium' },
  { id: 'hq3', subject: 'history', question: 'Who was the first President of Kenya?', options: ['Jomo Kenyatta', 'Mwai Kibaki', 'Uhuru Kenyatta', 'Daniel arap Moi'], correctAnswer: 0, difficulty: 'easy' },
  { id: 'hq4', subject: 'history', question: 'The Scramble for Africa occurred in which century?', options: ['16th', '17th', '18th', '19th'], correctAnswer: 3, difficulty: 'medium' },

  /* ===== Geography ===== */
  { id: 'gq1', subject: 'geography', question: 'Largest continent by area?', options: ['Africa', 'North America', 'Asia', 'Europe'], correctAnswer: 2, difficulty: 'easy' },
  { id: 'gq2', subject: 'geography', question: 'Longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctAnswer: 1, difficulty: 'easy' },
  { id: 'gq3', subject: 'geography', question: 'Which layer of Earth is liquid?', options: ['Crust', 'Mantle', 'Outer Core', 'Inner Core'], correctAnswer: 2, difficulty: 'medium' },
  { id: 'gq4', subject: 'geography', question: 'Equator passes through how many continents?', options: ['2', '3', '4', '5'], correctAnswer: 1, difficulty: 'medium' },
  { id: 'gq5', subject: 'geography', question: 'What causes tides?', options: ['Wind', 'Moon\'s gravity', 'Earth\'s rotation', 'Sun\'s heat'], correctAnswer: 1, difficulty: 'easy' },
];

/* ------------------------------------------------------------------
   Resources data
   ------------------------------------------------------------------ */

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'website' | 'formula' | 'book';
  subject: string;
  description: string;
  url: string;
}

export const RESOURCES: Resource[] = [
  { id: 'r1', title: 'Mathematics Formula Sheet', type: 'formula', subject: 'mathematics', description: 'All essential formulas for algebra, calculus, and trigonometry', url: '#' },
  { id: 'r2', title: 'Physics Formula Handbook', type: 'formula', subject: 'physics', description: 'Comprehensive physics formulas and constants', url: '#' },
  { id: 'r3', title: 'Chemistry Periodic Table', type: 'pdf', subject: 'chemistry', description: 'Interactive periodic table with element details', url: '#' },
  { id: 'r4', title: 'Biology Diagrams Collection', type: 'pdf', subject: 'biology', description: 'Labelled diagrams for all major biological systems', url: '#' },
  { id: 'r5', title: 'English Grammar Guide', type: 'pdf', subject: 'english', description: 'Complete grammar reference with examples', url: '#' },
  { id: 'r6', title: 'ICT Programming Notes', type: 'pdf', subject: 'ict', description: 'Programming fundamentals and practice problems', url: '#' },
  { id: 'r7', title: 'Khan Academy - Mathematics', type: 'website', subject: 'mathematics', description: 'Free video lessons and practice exercises', url: '#' },
  { id: 'r8', title: 'CrashCourse Physics', type: 'video', subject: 'physics', description: 'Engaging physics video series', url: '#' },
  { id: 'r9', title: 'Organic Chemistry Tutor', type: 'video', subject: 'chemistry', description: 'Step-by-step chemistry problem solving', url: '#' },
  { id: 'r10', title: 'BBC Bitesize Biology', type: 'website', subject: 'biology', description: 'Interactive biology lessons and quizzes', url: '#' },
  { id: 'r11', title: 'Economics Textbook PDF', type: 'book', subject: 'economics', description: 'Principles of Economics by Mankiw', url: '#' },
  { id: 'r12', title: 'World History Atlas', type: 'pdf', subject: 'history', description: 'Historical maps and timelines', url: '#' },
  { id: 'r13', title: 'Geography Map Skills Guide', type: 'pdf', subject: 'geography', description: 'Map reading and interpretation skills', url: '#' },
  { id: 'r14', title: 'Python Programming Book', type: 'book', subject: 'ict', description: 'Automate the Boring Stuff with Python', url: '#' },
  { id: 'r15', title: 'Literary Analysis Handbook', type: 'book', subject: 'english', description: 'Guide to analyzing literature and poetry', url: '#' },
];
